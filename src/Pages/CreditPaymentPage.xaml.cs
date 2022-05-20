namespace Wallet;

public partial class CreditPaymentPage : ContentPage
{
	public CreditPaymentPage(string balance, string creditSource)
	{
		InitializeComponent();
		string[] banks = File.ReadAllLines(MainPage.listOfBanks);
		banks = banks.Where(x => !string.IsNullOrEmpty(x)).ToArray();
		BankPicker.ItemsSource = banks;
		CreditAmount.Text = balance;
		SourceName.Text = creditSource;
	}
	private async void AddCreditButton_Clicked(object sender, EventArgs e)
    {
		AddCreditButton.IsEnabled = false;
		string creditAmount = CreditAmount.Text;
		string sourceofcredit = SourceName.Text;
		string date = (Convert.ToString(DateTime.Now)).Split(" ")[0];
		string month = DateTime.Now.ToString("MMMM");
		string year = DateTime.Now.ToString("yyyy");
		if (BankPicker.SelectedItem == null || creditAmount == "" || sourceofcredit == "")
		{
			await DisplayAlert("Invalid Options", "Enter the Bank Name to be Credited, enter the credited amount, enter the source of the credit and try again", "Ok");
            AddCreditButton.IsEnabled = true;
        }
		else
        {
			int creditedAmount = Convert.ToInt32(CreditAmount.Text);
			string banks = File.ReadAllText(MainPage.listOfBanks);
			string bankSelected = BankPicker.SelectedItem.ToString();
			string bank_1 = bankSelected.Split("--")[0];
			int currentAmount = Convert.ToInt32(bankSelected.Split("--Curr Balance : Rs. ")[1]);
			string dirPath = Path.Join(MainPage.WalletFolder, bank_1);
			string filePath = Path.Join(dirPath, $"{month} {year}.txt");
			if (!Directory.Exists(dirPath))
			{
				Directory.CreateDirectory(dirPath);
			}
			if (!File.Exists(filePath))
			{
				File.Create(filePath).Close();
			}
			int balanceToBe = currentAmount + creditedAmount;
			string lastBalance = balanceToBe.ToString();
			string contentsToAppend = $"{date} : CREDIT \n{sourceofcredit}\nRs.{creditAmount} \nCurrent Balance : Rs. {balanceToBe}\n\n";
			banks = banks.Replace(bankSelected, $"{bank_1}--Curr Balance : Rs. {lastBalance}");
			File.AppendAllText(filePath, contentsToAppend);
			File.WriteAllText(MainPage.listOfBanks, banks);
			await DisplayAlert("Payment added Successfully", "Your credit payment was added successfully", "Ok");
			GoBackHome.IsVisible = true;
			AddAnotherCredit.IsVisible = true;
		}
	}
	private async void GoBackHome_Clicked(object sender, EventArgs e)
	{
		await Navigation.PushAsync(new MainPage());
	}
	private async void AddAnotherCredit_Clicked(object sender, EventArgs e)
    {
		await Navigation.PushAsync(new CreditPaymentPage("", ""));
    }
}