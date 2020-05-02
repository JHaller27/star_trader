export enum CompareResult {
    LessThan = -1,
    EqualTo = 0,
    GreaterThan = 1,
};

export interface IComparable {
    compareTo(other: IComparable): CompareResult;
}
