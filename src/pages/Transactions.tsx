const Transactions = () => {
  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <h1
        className="text-3xl font-bold"
        style={{ color: "var(--text-default)" }}
      >
        Transactions
      </h1>
      <p className="mt-2" style={{ color: "var(--text-muted)" }}>
        Your transaction history will appear here.
      </p>
    </div>
  );
};

export default Transactions;
