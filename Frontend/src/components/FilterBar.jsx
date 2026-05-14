const FilterBar = ({ category, setCategory }) => {

  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="border p-3 rounded"
    >
      <option value="">All</option>

      <option value="IIT-JEE">
        IIT-JEE
      </option>

      <option value="NEET">
        NEET
      </option>

      <option value="UPSC">
        UPSC
      </option>

    </select>
  );
};

export default FilterBar;