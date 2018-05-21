export class RequestStatus {
    public status: string;
    public createdDateTime: Date;
    public lastActionDateTime: Date;
    public processingResult: ProcessingResult;

    constructor(enrollmentStatus: RequestStatus) {
        Object.assign(this, enrollmentStatus);
    }
}

export class ProcessingResult {
    public enrollmentStatus: string;
    public remainingEnrollmentSpeechTime: number;
    public speechTime: number;
    public enrollmentSpeechTime: number;

    public identifiedProfileId: string;
    public confidence: string;

    constructor(processingResult: ProcessingResult) {
        Object.assign(this, processingResult);
    }
}
