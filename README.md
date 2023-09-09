# Wallet
Wallet - The app designed and developed to keep track of your Cash, Bank, Debit Card and Credit Card Transactions

### **Wallet Version 2.0**

**Intro**

Hello everyone! I am Abhinav Satheesh and I have created this app named Wallet. Now, earlier in 2022, I had created the v1.0 of this app but that was in .NET MAUI, literally C#, but that had support only for Windows and Android and also lack of sync between them. Now, after a lot of brainstorming sessions and programming, this app has been entirely rewritten in JavaScript, the language of the Web. Yes, you got it! Wallet is now live on the Web, bringing in support to all devices that support the Internet. Plus, I have been able to implement live syncing between all devices signed into a user account by uploading user data to SupaBase, a free alternative to Firebase.

**The links of Wallet are:**
1) [GitHub Pages](https://thefinancials.github.io/Wallet/)
2) [Render](https://wallet-aluf.onrender.com/)

Both these links are functional and are working with expected speeds. 

**Features**
1. Multi-Device Support
    Wallet works on all devices that support the Web. That makes it all the major platforms in the World, like Windows, Android, iOS, 
    iPadOS, macOS, Linux etc. Plus, users have the benefit of syncing content between devices. Add a transaction in your laptop and see
    it automatically update in your phone. Or, if you are away from your phone for a while, you get periodic updates on your Tablet or 
    iPad.

2. Background Sync Support
    Imagine a situation where you don't open the app for weeks, and realise that a credit card statement has been generated, and you 
    weren't aware of it. This could potentially result in late payment along with interest on the payment amount. That's why, Wallet
    saved you the trouble and introduced Background Sync Support for Wallet. 

    > Background Sync is basically Periodic Sync API for Service Workers in the background. This is currently supported in Windows and
        Android only. iOS users, sorry! Let's wait for Apple to introduce it. As soon as Apple releases the feature, Wallet will automatically 
        support it
3. SMS Support
    This is a major milestone feature for Wallet, targeting iOS, iPadOS and macOS and Windows. Native apps on these platforms do not  
    have permission to access SMS from the Messages app. That's why, I thought differently, and created a Shortcut on these platforms. 
    The link to the shortcut is [this](https://www.icloud.com/shortcuts/2be95ab755314f02939c22ac10308918). Please ensure you grant 
    the necessary permissions for the shortcut to run. You can also create a widget for this Shortcut on the home screen.
    Once the SMS Transaction page opens, copy paste your SMS into the Text Area. Wallet then analyses the Transaction and displays 
    the results. Simply press Add, and voila! The transaction is added.

4. Banks, Credit Cards and Cash supported
    Wallet supports all Banks and Credit Cards. If your bank is not there in the list in the App, please select _Other_ in the options and 
     type your bank's name. 

**Milestone ahead**
I request the developer community to help me with ways to integrate [Wealthfolio](https://wealthfolio.onrender.com) with Wallet. This will bring additional utility with managing your stocks, mutual funds and your credit cards and banks at one platform. Please help me with ways to get live share prices in Nifty and Sensex using NodeJS.

I also want to bring in Telegram here. Introducing a Telegram bot, would help users get notifications and alerts in Telegram itself, serving as a potential substitute for iOS users, who don't have access to Web Notifications or Periodic Sync. 

Wallet
Developed by [Abhinav Satheesh](https://github.com/abhinavsatheesh)
Version 2.0
Releasing on 12:00 PM, 9th September 2023