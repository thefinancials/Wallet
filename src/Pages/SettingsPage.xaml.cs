namespace Wallet;

public partial class SettingsPage : ContentPage
{
    
    public SettingsPage()
	{
		InitializeComponent();
        Developed.Text = $"Wallet\nDeveloped by Abhinav Satheesh\nProject publicly available at GitHub";
	}

    private async void Button_Clicked(object sender, EventArgs e)
    {
		await Navigation.PushAsync(new AddBankAccountPage());
    }

    private async void Button_Clicked_1(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new DeleteBankAccountPage());
    }

    private async void Button_Clicked_2(object sender, EventArgs e)
    {
        bool answer = await DisplayAlert("Warning!", "You are about to reset Wallet. This deletes all the banks you have added, all the transactions made, and reinstalls Wallet. Are you sure you want to reset Wallet?", "Yes", "No");
        if (answer == true)
        {
            string result = await DisplayPromptAsync("One last confirmation", "Enter PLEASE RESET WALLET below, and Wallet will reset itself");
            if (result == "PLEASE RESET WALLET")
            {
                Directory.Delete(MainPage.WalletFolder, recursive: true);
                await DisplayAlert("Wallet Database Deleted", "Wallet has been successfully reset.", "Ok");
                await Navigation.PushAsync(new WalletSplashScreen());
            }
        }
    }
}