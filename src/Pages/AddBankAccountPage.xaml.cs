namespace Wallet;

public partial class AddBankAccountPage : ContentPage
{
	public AddBankAccountPage()
	{
		InitializeComponent();
		var banks = new List<String>();
		banks.Add("State Bank of India");
		banks.Add("HDFC Bank");
		banks.Add("Federal Bank");
		banks.Add("ICICI Bank");
		banks.Add("Bank of Baroda");
		banks.Add("Indian Bank");
		banks.Add("IndusInd Bank");
		banks.Add("IDFC First Bank");
		banks.Add("South Indian Bank");
		BankPicker.ItemsSource = banks;
	}
	private async void Button_Clicked(object sender, EventArgs e)
	{
		if (!Directory.Exists(MainPage.WalletFolder))
		{
			Directory.CreateDirectory(MainPage.WalletFolder);
		}
		if (!File.Exists(MainPage.listOfBanks))
		{
			File.Create(MainPage.listOfBanks);
		}
		if (BankPicker.SelectedItem == null || BalanceAccount.Text == "")
		{
			await DisplayAlert("Invalid Option", "Please select a Bank, enter Bank Balance and try again", "Ok");
		}
		else
		{
			string bankSelected = (BankPicker.SelectedItem).ToString();
			string completeTextToAppend = $"\n{bankSelected}--Curr Balance : Rs. {BalanceAccount.Text}";
			File.AppendAllText(MainPage.listOfBanks, completeTextToAppend);
			Directory.CreateDirectory(Path.Join(MainPage.WalletFolder, bankSelected));
			await DisplayAlert("Bank added successfully", $"{bankSelected} has been added successfully. We wish to inform you that all your details are securely stored in your device only, and not even shared with our Server. ", "Ok");
			await Navigation.PushAsync(new MainPage());
		}
	}
}