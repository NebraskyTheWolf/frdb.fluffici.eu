type Dataset = {
    label: string;
    data: number[];
    backgroundColor: string;
}

export class ChartData {
    labels: string[];
    datasets: Dataset[];

    constructor(labels: string[], datasets: Dataset[]) {
        this.labels = labels;
        this.datasets = datasets;
    }
}
