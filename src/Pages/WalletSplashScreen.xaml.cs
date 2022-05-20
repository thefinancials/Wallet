namespace Wallet;

public partial class WalletSplashScreen : ContentPage
{
	public WalletSplashScreen()
	{
		InitializeComponent();
		Features.Text = "UPI\nNetbanking\nDebit Card Payments";
	}

    private async void Button_Clicked(object sender, EventArgs e)
    {
		await Navigation.PushAsync(new AddBankAccountPage());
    }
}