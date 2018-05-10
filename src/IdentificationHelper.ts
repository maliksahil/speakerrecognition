import * as request from "request";
import { config } from "./config";
import * as querystring from "querystring";
import * as fs from "fs";
import { Buffer } from "buffer";
import { RequestStatus } from "./BusinessObjects";

// IDENTIFICATION PROFILE METHODS
// returns identificationProfileId
export function createIdentificationProfile(): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
        const requestOptions = getRequestOptions();
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.body = JSON.stringify({
            'locale': 'en-us'
        });

        request.post(
            config.speakerRecognitionAPI.endPoint + '/identificationProfiles',
            requestOptions,
            (err, response, body) => {
                if (err) { reject(err); }
                else { resolve((JSON.parse(body).identificationProfileId)); }
            }
        );
    });
    return promise;
}

export function deleteIdentificationProfile(identificationProfileId: string): Promise<boolean> {
    const promise = new Promise<boolean>((resolve, reject) => {
        const requestOptions = getRequestOptions();
        requestOptions.headers['Content-Type'] = 'application/json';
        request.delete(
            config.speakerRecognitionAPI.endPoint + '/identificationprofiles/' + identificationProfileId,
            requestOptions,
            (err, response, body) => {
                if (err) { reject(false); }
                else {
                    console.log('deleted: ' + identificationProfileId);
                    resolve(true);
                }
            }
        )
    });
    return promise;
}

/// ENROLLMENT METHODS
export function createEnrollment(
    fileName: string, identificationProfileId: string):
    Promise<RequestStatus> {
    const promise = new Promise<RequestStatus>((resolve, reject) => {
        const requestOptions = getRequestOptions();
        requestOptions.body = readFile(__dirname + "/" + fileName)
        const uri = config.speakerRecognitionAPI.endPoint +
            '/identificationProfiles/' + identificationProfileId +
            '/enroll';
        request.post(
            uri,
            requestOptions,
            (err, response, body) => {
                if (err) { reject(false); }
                else {
                    const requestUrl = response.headers['operation-location'].toString();
                    console.log(requestUrl);
                    const timer = setInterval(() => {
                        request.get(requestUrl, requestOptions,
                            (err, response, body) => {
                                const enrollmentStatus = new RequestStatus(JSON.parse(body));
                                if (enrollmentStatus.status === 'succeeded') {
                                    clearInterval(timer);
                                    if (enrollmentStatus.processingResult.enrollmentStatus
                                        === "Enrolling") {
                                        console.log(
                                            'Supply a little more audio, atleast 30 seconds. Currently at: '
                                            + enrollmentStatus.processingResult.speechTime);
                                    }
                                    resolve(enrollmentStatus);
                                } else {
                                    console.log('Waiting for enrollment to finish');
                                }
                            });
                    }, 1000);
                }
            }
        )
    });
    return promise;
}

export function identifySpeaker(fileName: string, identificationProfileIds: string): Promise<RequestStatus> {
    const promise = new Promise<RequestStatus>((resolve, reject) => {
        const requestOptions = getRequestOptions();
        requestOptions.body = readFile(__dirname + "/" + fileName)
        const uri = config.speakerRecognitionAPI.endPoint + '/identify?identificationProfileIds=' + identificationProfileIds
        request.post(
            uri,
            requestOptions,
            (err, response, body) => {
                if (err) { reject(false); }
                else {
                    // https://westus.api.cognitive.microsoft.com/spid/v1.0/operations/
                    const requestUrl = response.headers['operation-location'].toString();
                    console.log(requestUrl);
                    let requestOptions: request.CoreOptions = {
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "Ocp-Apim-Subscription-Key": config.speakerRecognitionAPI.key1
                        }
                    };
                    const timer = setInterval(() => {
                        request.get(requestUrl, requestOptions,
                            (err, response, body) => {
                                const identificationStatus = new RequestStatus(JSON.parse(body));
                                if (identificationStatus.status === 'succeeded') {
                                    clearInterval(timer);
                                    resolve(identificationStatus);
                                } else {
                                    console.log('Waiting for identification to finish');
                                }

                            });
                    }, 1000);
                }
            }
        )
    });
    return promise;
}

function getRequestOptions(): request.CoreOptions {
    return {
        headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": config.speakerRecognitionAPI.key1
        }
    };
}

function readFile(filePath: string) {
    const fileData = fs.readFileSync(filePath).toString("hex");
    const result = [];
    for (let i = 0; i < fileData.length; i += 2) {
        result.push(parseInt(fileData[i] + "" + fileData[i + 1], 16))
    }
    return new Buffer(result);
}