namespace Wallet;

public partial class ViewStatements : ContentPage
{
	public ViewStatements(string contents)
	{
		InitializeComponent();
		TRANSACTIONS.Text = contents;
	}
}