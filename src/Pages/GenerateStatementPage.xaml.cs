using Microsoft.Maui.Devices;

namespace Wallet;

public partial class GenerateStatementPage : ContentPage
{
	public GenerateStatementPage()
	{
		InitializeComponent();
		string[] banks = File.ReadAllLines(MainPage.listOfBanks);
		banks = banks.Where(x => !string.IsNullOrEmpty(x)).ToArray();
		BankPicker.ItemsSource = banks;
		string[] months = { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
		MonthPicker.ItemsSource = months;
		IEnumerable<int> InclusiveRange(int s, int e)
		{
			for (int i = s; i <= e; i++)
			{
				yield return i;
			}
		}
		var r = InclusiveRange(2022, 2100).ToList();
		YearPicker.ItemsSource = r;
		if (DeviceInfo.Platform == DevicePlatform.Android)
        {
			GetFileFormat.Items.Clear();
			GetFileFormat.Items.Add("View the Statement");
        }
    }

    private async void GetStatement_Clicked(object sender, EventArgs e)
    {
		var bankSelected_TEST = BankPicker.SelectedItem;
		var monthSelected_TEST = MonthPicker.SelectedItem;
		var yearSelected_TEST = YearPicker.SelectedItem;
		var fileFormatSelected_TEST = GetFileFormat.SelectedItem;
		if (bankSelected_TEST == null || monthSelected_TEST == null || yearSelected_TEST == null || fileFormatSelected_TEST == null)
		{
			await DisplayAlert("Invalid Options", "Please select a Bank Account, a Month, a Year, a File Format to export your statement and try again", "Ok");
		}
		else
		{
			string bankSelected = (bankSelected_TEST.ToString()).Split("--Curr Balance : Rs.")[0];
			string monthSelected = monthSelected_TEST.ToString();
			string yearSelected = yearSelected_TEST.ToString();
			string fileFormatSelected = fileFormatSelected_TEST.ToString();
			string FilePath = Path.Join(MainPage.WalletFolder, bankSelected, $"{monthSelected} {yearSelected}.txt");
			if (!File.Exists(FilePath))
            {
				await DisplayAlert("No transactions found", "No Transactions found for the specified period. Select another Month or Year and try again", "Ok");
			}
			else
            {
				if (fileFormatSelected == "Text File (.txt)")
                {
					string tempFilePath = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), $"{bankSelected} - {Path.GetFileName(FilePath)}");
                    File.Copy(FilePath, tempFilePath);
					await DisplayAlert("Statement Exported Successfully", "Your statement has been successfully exported to your Documents Folder as a Text file", "Ok");
				}

				else if (fileFormatSelected == "CSV File (.csv)")
				{
					string tempFilePath = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), $"{bankSelected} - {Path.GetFileNameWithoutExtension(FilePath)}.csv");
					int i, j;
					StreamWriter csvfile;
					string[] lines, cells;
					lines = File.ReadAllLines(FilePath);
					csvfile = new StreamWriter(tempFilePath);
					for (i = 0; i < lines.Length; i++)
					{
						cells = lines[i].Split(new Char[] { '\t', ';' });
						for (j = 0; j < cells.Length; j++)
							csvfile.Write(cells[j] + ",");
						csvfile.WriteLine();
					}
					csvfile.Close();
					await DisplayAlert("Statement Exported Successfully", "Your statement has been successfully exported to your Documents Folder as a CSV file", "Ok");
				}
				else if (fileFormatSelected == "View the Statement")
                {
					string transactions = File.ReadAllText(FilePath);
					await Navigation.PushAsync(new ViewStatements(transactions));
                }
			}
        }
    }
}