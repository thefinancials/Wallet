namespace Wallet;

public partial class DebitPaymentPage : ContentPage
{
	public DebitPaymentPage(string balance, string debitSource)
	{
		InitializeComponent();
		string[] banks = File.ReadAllLines(MainPage.listOfBanks);
		banks = banks.Where(x => !string.IsNullOrEmpty(x)).ToArray();
		BankPicker.ItemsSource = banks;
	}

    private async void AddDebitButton_Clicked(object sender, EventArgs e)
    {
        AddDebitButton.IsEnabled = false;
        string debitAmount = DebitAmount.Text;
		string nameOfCreditr = CreditorName.Text;
		string date = (Convert.ToString(DateTime.Now)).Split(" ")[0];
        string month = DateTime.Now.ToString("MMMM");
        string year = DateTime.Now.ToString("yyyy");
		if (PaymentMode.SelectedItem == null || BankPicker.SelectedItem == null || debitAmount == "" || nameOfCreditr == "")
        {
			await DisplayAlert("Invalid Options", "Enter the Bank Name to be debited, enter the debited amount, enter the name of the creditor, and the payment mode and try again", "Ok");
            AddDebitButton.IsEnabled = true;
        }
		else
        {
			int debitedAmount = Convert.ToInt32(DebitAmount.Text);
			string banks = File.ReadAllText(MainPage.listOfBanks);
			string bankSelected = BankPicker.SelectedItem.ToString();
            string bank_1 = bankSelected.Split("--")[0];
            int currentAmount = Convert.ToInt32(bankSelected.Split("--Curr Balance : Rs. ")[1]);
            string paymentSelected = PaymentMode.SelectedItem.ToString();
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
            int balanceToBe = currentAmount - debitedAmount;
            string lastBalance = balanceToBe.ToString();
            string contentsToAppend = $"{date} : DEBIT \n{nameOfCreditr}\nRs. {debitAmount} \nPayment Mode : {paymentSelected} \nCurrent Balance : Rs. {balanceToBe}\n\n";
            banks = banks.Replace(bankSelected, $"{bank_1}--Curr Balance : Rs. {lastBalance}");
            File.AppendAllText(filePath, contentsToAppend);
            File.WriteAllText(MainPage.listOfBanks, banks);
            await DisplayAlert("Payment added Successfully", "Your debit payment was added successfully", "Ok");
            GoBackHome.IsVisible = true;
            AddAnotherDebit.IsVisible = true;
        }
    }

    private async void GoBackHome_Clicked(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new MainPage());
    }

    private async void AddAnotherDebit_Clicked(object sender, EventArgs e)
    {
        await Navigation.PushAsync(new DebitPaymentPage("", ""));
    }
}