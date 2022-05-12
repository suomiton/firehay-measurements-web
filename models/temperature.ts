export interface FirehayStatus {
    id: string;
    locationId: string;
    location: string;
    temperature: number;
    temp6Avg: number;
    temp24Avg: number;
    pressure: number;
    humidity: number;
    timeStamp: string;
};

export interface FirehayLocationStatus extends FirehayStatus {
    lastWeek: Measurement[];
}

export interface Measurement {
    temperature: number;
    timeStamp: string;
    humidity: number;
    pressure: number;
}

export interface ClientExtendedStatus extends FirehayStatus {
    timeStampDistance: string;
}