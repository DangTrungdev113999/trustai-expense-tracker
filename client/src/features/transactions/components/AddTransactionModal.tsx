export function AddTransactionModal() {
  return (
    <form>
      <fieldset>
        <legend>Type</legend>
        <label>
          <input type="radio" name="type" value="income" defaultChecked />
          Income
        </label>
        <label>
          <input type="radio" name="type" value="expense" />
          Expense
        </label>
      </fieldset>

      <div>
        <label htmlFor="tx-category">Category</label>
        <select id="tx-category" name="category">
          <option value="">Select category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="tx-amount">Amount</label>
        <input id="tx-amount" type="number" name="amount" min="0" step="any" />
      </div>

      <div>
        <label htmlFor="tx-date">Date</label>
        <input id="tx-date" type="date" name="date" />
      </div>

      <div>
        <label htmlFor="tx-note">Note</label>
        <textarea id="tx-note" name="note" />
      </div>

      <button type="submit">Add Transaction</button>
    </form>
  )
}
