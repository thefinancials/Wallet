global using System;
global using System.IO;
global using System.Diagnostics;

namespace Wallet;

public partial class MainPage : ContentPage
{
	public static string WalletFolder = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Wallet");
	public static string listOfBanks = Path.Join(WalletFolder, "listOfBanks.txt");
	public MainPage()
	{
		InitializeComponent();
		Debug.WriteLine(WalletFolder);
		CheckForFiles();
	}
	public async void CheckForFiles()
    {
		if (!Directory.Exists(WalletFolder))
        {
			Directory.CreateDirectory(WalletFolder);
			File.Create(listOfBanks).Close();
			await Navigation.PushAsync(new WalletSplashScreen());
        }
		if (!File.Exists(listOfBanks))
        {
			File.Create(listOfBanks).Close();
			await Navigation.PushAsync(new WalletSplashScreen());
        }
		string[] banks = File.ReadAllLines(listOfBanks);
		banks = banks.Where(x => !string.IsNullOrEmpty(x)).ToArray();
		if (banks.Length == 0)
        {
			await Navigation.PushAsync(new WalletSplashScreen());
        }
		else
        {
			QuickLookBalance.Text = "Quick Check your Bank Balance\n";
			foreach (string bank in banks)
			{
				string bankName = bank.Split("--")[0];
				string bankBalance = bank.Split("--Curr Balance : ")[1];
				string complete = $"\n{bankName} : Current balance is {bankBalance}";
				QuickLookBalance.Text += complete;
			}
		}
    }

    private async void Button_Clicked(object sender, EventArgs e)
    {
		await Navigation.PushAsync(new DebitPaymentPage("", ""));
    }

    private async void Button_Clicked_1(object sender, EventArgs e)
    {
		await Navigation.PushAsync(new CreditPaymentPage("", ""));
    }

    private async void Button_Clicked_2(object sender, EventArgs e)
    {
		await Navigation.PushAsync(new GenerateStatementPage());
    }

    private async void Button_Clicked_3(object sender, EventArgs e)
    {
		await Navigation.PushAsync(new SettingsPage());
    }
}

