# User flow

<figure><img src="https://2429027697-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FLjGi8TfFqGtUxIX4Qv76%2Fuploads%2FP52BgHMQCn1nxTyVykne%2FUser%20Flow.png?alt=media&#x26;token=63aa2668-9396-4ca0-851f-872fbead1265" alt=""><figcaption><p>onramp userflow</p></figcaption></figure>

User actions can be covered in 3 simple steps (all complexities are handled by onramp)&#x20;

1. User logs in via OTP&#x20;
2. User confirms transaction details&#x20;
3. User makes the payment&#x20;

**Overview of the flow**

1. Partner directs the user to onramp, while passing&#x20;
   1. Wallet address&#x20;
   2. App id&#x20;
   3. Crypto amount (optional)
2. User is asked to login in via phone based OTP, where the KYC level of the user is checked, incase the user has exceeded the threshold, the user is prompted to complete the next tier of KYC to proceed further&#x20;
3. Once the user is logged in, transaction details are shown to the user to confirm and proceed to the next step.&#x20;
4. Bank account details would be fetched based on the user’s geographical location.&#x20;
5. The account details are displayed and the user is prompted to make the payment using a payment method of his choice.&#x20;
6. After successfully completing the payment, deposit is confirmed once the payment has been received, an equivalent amount of cryptocurrency is bought at market price.
7. The crypto withdrawal onchain is then initiated to the user's address, and the user is redirected back to the platform.



# User flow (Version)

<figure><img src="https://2429027697-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FLjGi8TfFqGtUxIX4Qv76%2Fuploads%2FZx8F6yU10tomrOTSUVfZ%2Fupdated_merchant_checkout_flow.png?alt=media&#x26;token=cc02510a-33e8-4a0e-8d61-4102bda55964" alt=""><figcaption><p>User flow overview</p></figcaption></figure>

User actions can be covered in 2 simple steps (all complexities are handled by Onramp):

1. User logs in via OTP (One Time Password).
2. User makes payment after confirming details.

Overview of the flow:

1. Partner directs the user to Onramp, while passing:&#x20;
   1. Partner wallet address&#x20;
   2. AppID&#x20;
   3. Asset description&#x20;
   4. &#x20;Asset image, etc.
2. User is asked to log in using phone-based OTP.
3. Once the user is logged in, they make the payment after confirming the transaction details.
4. After successfully completing the payment, the deposit is confirmed once the payment has been received, and an equivalent amount of cryptocurrency is bought at market price.
5. The crypto withdrawal on-chain is then initiated to the Partner's wallet address, and the user is redirected back to the platform.
6. The partner would then have to send the confirmed asset to the user.
`