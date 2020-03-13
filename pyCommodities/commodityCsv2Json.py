import csv
import json
import sys

if len(sys.argv) < 3:
    print('Usage: csv_path json_path', file=sys.stderr)
    exit(1)

csv_in_path = sys.argv[1]
json_out_path = sys.argv[2]

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

def buySellLines(itr) -> (list, list):
    '''
    Return (buy, sell)
    '''
    while True:
        try:
            buy = convert_row(next(itr))
            sell = convert_row(next(itr))

            yield buy, sell
        except StopIteration:
            return

with open(csv_in_path, newline='') as fin:
    reader = csv.reader(fin)

    i = iter(reader)
    raw_locs = next(i)

    for loc in raw_locs[1:]:
        commodities.append({
            'location': ['Stanton'] + loc.split(' > '),
            'commodities': []
        })

    for buy_prices, sell_prices in buySellLines(i):

        # Swap buy to selling and sell to buying due to semantics
        #   CSV assumes perspective of player (e.g. 'player can buy this')
        #   JSON assumes perspective of port (e.g. 'port is selling this')
        name = buy_prices[0]
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

with open(json_out_path, 'w') as fout:
    fout.write(json_text)
