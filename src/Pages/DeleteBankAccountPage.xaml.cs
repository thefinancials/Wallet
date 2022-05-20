namespace Wallet;

public partial class DeleteBankAccountPage : ContentPage
{
	public DeleteBankAccountPage()
	{
		InitializeComponent();
		string[] banks = File.ReadAllLines(MainPage.listOfBanks);
		banks = banks.Where(x => !string.IsNullOrEmpty(x)).ToArray();
		BankPicker.ItemsSource = banks;
	}

	private async void Button_Clicked_1(object sender, EventArgs e)
    {
		if (BankPicker.SelectedItem == null)
		{
			await DisplayAlert("Select a Bank Account", "Please select a Bank Account and then retry", "Ok");
		}
		else
		{
			bool answer = await DisplayAlert("Warning!", "You are about to delete this bank account. Deleting an Account deletes it from our Records and you will not be able to add any more payments to this account. You will not be able to view the transactions you have made with this account. Are you sure you want to delete this account?", "Yes", "No");
			if (answer == true)
			{
				string bank = BankPicker.SelectedItem.ToString();
				string bankkks = File.ReadAllText(MainPage.listOfBanks);
				bankkks = bankkks.Replace(bank, "");
				string bankname = bank.Split("--")[0];
				Directory.Delete(Path.Join(MainPage.WalletFolder, bankname), recursive: true);
				File.WriteAllText(MainPage.listOfBanks, bankkks);
				await DisplayAlert("Account deleted successfully", "This account has been deleted successfully", "Ok");
				string[] banks = File.ReadAllLines(MainPage.listOfBanks);
				banks = banks.Where(x => !string.IsNullOrEmpty(x)).ToArray();
				if (banks.Length >= 1)
				{
					await Navigation.PushAsync(new MainPage());
				}
				else
                {
					await Navigation.PushAsync(new AddBankAccountPage());
                }
			}
		}
	}
}