import * as vkbeautify from 'vkbeautify';
import * as identification from './IdentificationHelper';
import { RequestStatus } from './BusinessObjects';

/////// IDENTIFICATION /////////
/// How to use
// First create an identification profile for sahil, and another for obama
// Then enroll for Sahil, with 1.wav, demonstrate that 1.wav is too short, so I also add 2.wav
// Next enroll for obama
// Finally run identification for Obama + Sahil
////////////////////////////////

// identification.createIdentificationProfile().then(
//     identificationProfile => {
//         console.log(identificationProfile);
//     });

// sahil
const sahilIdentificationProfile = '537fa705-e576-4844-b0a8-be6e9d6f50b9';

// identification.createEnrollment(
//     '/Data/Sahil/1.wav',
//     sahilIdentificationProfile).then(
//         (result: RequestStatus) => {
//             console.log('1.wav enrolled');
//         });

// identification.createEnrollment('/Data/Sahil/2.wav', sahilIdentificationProfile).then((result:RequestStatus) => {
//     console.log('2.wav enrolled');
// });

// identification.identifySpeaker('sahil_input.wav', sahilIdentificationProfile).then(result => {
//     console.log(`Identified profile is: ${result.processingResult.identifiedProfileId} and the confidence is: ${result.processingResult.confidence}`)
// });


// Obama
const obamaIdentificationProfile = '7043adc1-f9ef-4b47-8fa9-2b898c348869';

// identification.createEnrollment('/Data/Obama/1.wav', obamaIdentificationProfile).then((result:RequestStatus) => {
//     console.log('1.wav enrolled');
// });

// identification.identifySpeaker(
//     'obama_input.wav', 
//     sahilIdentificationProfile + ',' + obamaIdentificationProfile).then(
//         result => {
//     console.log(
//         `Identified profile is: 
//             ${result.processingResult.identifiedProfileId} 
//             and the confidence is: 
//             ${result.processingResult.confidence}`)
// });


// identification.deleteIdentificationProfile(obamaIdentificationProfile);
// identification.deleteIdentificationProfile(sahilIdentificationProfile);
