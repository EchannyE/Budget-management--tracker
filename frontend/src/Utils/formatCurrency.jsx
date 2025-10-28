const formatCurrency = (amount) => `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

export default formatCurrency;