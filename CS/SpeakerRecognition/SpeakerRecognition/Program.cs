using System;

namespace SpeakerRecognition
{
    class MainClass
    {
        public static void Main(string[] args)
        {
			/////// IDENTIFICATION /////////
            /// How to use
            // First create an identification profile for sahil, and another for obama
            // Then enroll for Sahil, with 1.wav, demonstrate that 1.wav is too short, so I also add 2.wav
            // Next enroll for obama
            // Finally run identification for Obama + Sahil
            ////////////////////////////////

			IdentificationHelper identificationHelper = new IdentificationHelper();

            //create identification profile
			//string identificationProfileId = identificationHelper.CreateIdentificationProfile().Result;
			//Console.WriteLine(identificationProfileId);

			string sahilIdentificationProfileId = "c89a8b13-58b0-4a5e-8a84-3d0c97d2b7f4";
			string obamaIdentificationProfileId = "cf2bbf6a-244e-4e98-b49d-326d8bd79264";

			// enroll sahil
			//string enrollmentResult = identificationHelper.CreateEnrollment("Data/Sahil/1.wav", sahilIdentificationProfileId).Result;
			//string enrollmentResult2 = identificationHelper.CreateEnrollment("Data/Sahil/2.wav", sahilIdentificationProfileId).Result;

			// enroll obama
			//string enrollmentResult3 = identificationHelper.CreateEnrollment("Data/Obama/1.wav", obamaIdentificationProfileId).Result;


			// identify
			string result = identificationHelper.IdentifySpeaker("Data/sahil_input.wav", 
			                                                     sahilIdentificationProfileId + "," + obamaIdentificationProfileId).Result;
			Console.WriteLine(result);

            // delete profiles
			//var result = identificationHelper.DeleteIdentificationProfile(sahilIdentificationProfileId).Result;
		    // var result = identificationHelper.DeleteIdentificationProfile(obamaIdentificationProfileId).Result;


        }
    }
}
