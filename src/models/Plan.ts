export class Plan {
    id?: number;
    offerSlug: string;
    offerName: string;
    offerDescription: string;
    offerPrice: number;
    offerDiscount: number | null;
    offerVat: number;
    offerFeatures: { included: boolean; description: string }[];
    createdAt?: Date;
    updatedAt?: Date;

    constructor(
        offerSlug: string,
        offerName: string,
        offerDescription: string,
        offerPrice: number,
        offerDiscount: number | null,
        offerVat: number,
        offerFeatures: { included: boolean; description: string }[]
    ) {
        this.offerSlug = offerSlug;
        this.offerName = offerName;
        this.offerDescription = offerDescription;
        this.offerPrice = offerPrice;
        this.offerDiscount = offerDiscount;
        this.offerVat = offerVat;
        this.offerFeatures = offerFeatures;
    }
}
