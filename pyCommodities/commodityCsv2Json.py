import csv
import json
import argparse

parser = argparse.ArgumentParser()

parser.add_argument('csv_path', type=str, help='Path to CSV to read from')
parser.add_argument('json_path', type=str, help='Path to JSON to write to')
parser.add_argument('--no-vice', '-v', dest='novice', action='store_true', help='Set this flag to exclude vice')

args = parser.parse_args()

commodities = []

def convert_row(line) -> list:
    row = []
    for el in line:
        if el == '':
            row.append(None)
        else:
            try:
                row.append(float(el))
            except ValueError:
                row.append(el)
    return row

def buySellLines(itr) -> (str, list, list):
    '''
    Return (name, buy, sell)
    '''
    while True:
        try:
            buy = convert_row(next(itr))
            sell = convert_row(next(itr))

            name = buy[0]

            yield name, buy, sell
        except StopIteration:
            return

with open(args.csv_path, newline='') as fin:
    reader = csv.reader(fin)

    i = iter(reader)
    raw_locs = next(i)

    for loc in raw_locs[1:]:
        commodities.append({
            'location': ['Stanton'] + loc.split(' > '),
            'commodities': []
        })

    for name, buy_prices, sell_prices in buySellLines(i):
        if args.novice and 'vice' in name.lower():
            continue

        # Swap buy to selling and sell to buying due to semantics
        #   CSV assumes perspective of player (e.g. 'player can buy this')
        #   JSON assumes perspective of port (e.g. 'port is selling this')
        for pidx in range(len(buy_prices) - 1):
            buy = buy_prices[pidx+1]
            sell = sell_prices[pidx+1]

            if buy is not None or sell is not None:
                commodities[pidx]['commodities'].append({
                    'name': name,
                    'buying': sell,
                    'selling': buy
                })

json_text = json.JSONEncoder(indent=4).encode(commodities)

with open(args.json_path, 'w') as fout:
    fout.write(json_text)
