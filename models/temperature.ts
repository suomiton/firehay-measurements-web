export interface FirehayStatusAM {
    readonly id: string;
    readonly locationId: string;
    readonly locationName: string;
    readonly temperature: number;
    readonly temperature6Avg: number;
    readonly temperature24Avg: number;
    readonly temperatureRatio: number;
    readonly temperatureUnit: string;
    readonly pressure: number;
    readonly pressureUnit: string;
    readonly humidity: number;
    readonly humidityUnit: string;
    readonly timeStamp: string;
    readonly isExternal: boolean;
};

export interface FirehayLocationStatus extends FirehayStatusAM {
    readonly lastWeek: MeasurementAM[];
}

export interface MeasurementAM {
    readonly timeStamp: string;
    readonly temperature: number;
    readonly temperatureExt: number;
    readonly humidity: number;
    readonly humidityExt: number;
    readonly pressure: number;
    readonly pressureExt: number;
}