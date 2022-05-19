export interface FirehayStatusAM {
    readonly id: string;
    readonly locationId: string;
    readonly location: string;
    readonly temperature: number;
    readonly temperature6Avg: number;
    readonly temperature24Avg: number;
    readonly temperatureRatio: number;
    readonly pressure: number;
    readonly humidity: number;
    readonly timeStamp: string;
};

export interface FirehayLocationStatus extends FirehayStatusAM {
    readonly lastWeek: MeasurementAM[];
}

export interface MeasurementAM {
    readonly temperature: number;
    readonly timeStamp: Date;
    readonly humidity: number;
    readonly pressure: number;
}

export interface ClientExtendedStatus extends FirehayStatusAM {
    readonly timeStampDistance: string;
}