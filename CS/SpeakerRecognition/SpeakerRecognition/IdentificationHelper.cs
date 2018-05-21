using System;
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;

using Flurl;
using Flurl.Http;
using System.Collections.Generic;

namespace SpeakerRecognition
{
	public class IdentificationHelper
	{
		public async Task<string> CreateIdentificationProfile()
		{
			var url = Config.endPoint + "/identificationProfiles";
			return await url
				.WithHeader("Accept", "application/json")
				.WithHeader("Ocp-Apim-Subscription-Key", Config.key1)
				.PostJsonAsync(new { locale = "en-us" }).ReceiveString();
		}

		public async Task<bool> DeleteIdentificationProfile(string identificationProfileId)
		{
			var url = Config.endPoint + "/identificationProfiles/" + identificationProfileId;
			var result = await url
			   .WithHeader("Accept", "application/json")
			   .WithHeader("Ocp-Apim-Subscription-Key", Config.key1)
				.DeleteAsync().ReceiveJson();
			return true;
		}

		public async Task<string> CreateEnrollment(string fileName, string identificationProfileId)
		{
			var enrollmentUrl = Config.endPoint + "/identificationProfiles/" + identificationProfileId + "/enroll";

			var fileBytes = readFileAsBytes(fileName);
            
			var result = await enrollmentUrl
				.WithHeader("Accept", "application/octet-stream")
				.WithHeader("Ocp-Apim-Subscription-Key", Config.key1)
				.PostAsync(new ByteArrayContent(fileBytes));

			string checkLocation = result.Headers.GetValues("operation-location").FirstOrDefault();
			string checkStatus = "";

			do
			{
				RequestStatus checkResult = await checkLocation
					.WithHeader("Accept", "application/json")
					.WithHeader("Ocp-Apim-Subscription-Key", Config.key1)
					.GetJsonAsync<RequestStatus>();

				checkStatus = checkResult.status;

				Console.WriteLine("Status:" + checkStatus);

                if (checkStatus == "succeeded")
				{
					if (checkResult.processingResult.enrollmentStatus == "Enrolling") 
					{
						Console.WriteLine(
							"Supply a little more audio, atleast 30 seconds. Currently at: " + 
							    checkResult.processingResult.speechTime);
					}
					else
					{
						Console.WriteLine("Done");
					}
				}
				else
                {
                    Console.WriteLine("Waiting for enrollment to finish");
                }
				System.Threading.Thread.Sleep(1000);

			} while (checkStatus != "succeeded");

			return ("done");
		}

		public async Task<string> IdentifySpeaker(string fileName, string identificationProfileIds)
		{
			var identificationUrl = Config.endPoint + "/identify?identificationProfileIds=" + identificationProfileIds;

			var fileBytes = readFileAsBytes(fileName);

			var result = await identificationUrl
                .WithHeader("Accept", "application/octet-stream")
                .WithHeader("Ocp-Apim-Subscription-Key", Config.key1)
                .PostAsync(new ByteArrayContent(fileBytes));

            string checkLocation = result.Headers.GetValues("operation-location").FirstOrDefault();
            string checkStatus = "";

            do
            {
				RequestStatus checkResult = await checkLocation
					.WithHeader("Accept", "application/json")
					.WithHeader("Ocp-Apim-Subscription-Key", Config.key1)
                    .GetJsonAsync<RequestStatus>();
                

				// Console.WriteLine("checkResult:" + checkResult);

                checkStatus = checkResult.status;
                Console.WriteLine("Status:" + checkStatus);

                if (checkStatus == "succeeded")
                {
					return checkResult.processingResult.identifiedProfileId;
                }
                else
                {
                    Console.WriteLine("Waiting for identification to finish");
                }
                System.Threading.Thread.Sleep(1000);
            } while (checkStatus != "succeeded"); 

			return ("done");
		}

		private byte[] readFileAsBytes(string fileName)
		{
			return System.IO.File.ReadAllBytes(fileName);
		}
	}

	public class RequestStatus
    {
		public string status;
		public DateTime createdDateTime;
		public DateTime lastActionDateTime;

		public ProcessingResult processingResult;
    }

    public class ProcessingResult
	{
		public string enrollmentStatus;
		public float remainingEnrollmentSpeechTime;
		public float speechTime;
		public float enrollmentSpeechTime;

		public string identifiedProfileId;
		public string confidence;
	}
}
