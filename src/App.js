import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '200px auto',
    padding: '45px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  select: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#dc3545',
    marginTop: '10px',
    fontSize: '14px',
  },
  results: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
  },
  resultsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  resultItem: {
    marginBottom: '5px',
    fontSize: '14px',
  },
};

const VacationSalaryCalculator = () => {
  const [inputs, setInputs] = useState({
    basicSalary: '',
    housingAllowance: '',
    transportAllowance: '',
    foodAllowance: '',
    productionBonus: '',
    fixedAllowances: '',
    otherAllowances: '',
    gosi: '',
    salaryFrom: '',
    vacationStartDate: '',
    vacationEndDate: '',
    vacationType: 'annual', // Defaulted to "annual"
  });

  const [results, setResults] = useState({
    workingDaysSalary: 0,
    vacationSalary: 0,
    deductions: 0,
    totalPayment: 0,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
    const formattedFirstDay = firstDayOfMonth.toISOString().split('T')[0];

    const formattedToday = today.toISOString().split('T')[0];
    const vacationEndDate = new Date(today.setDate(today.getDate() + 30))
      .toISOString()
      .split('T')[0];

    setInputs((prev) => ({
      ...prev,
      salaryFrom: formattedFirstDay,
      vacationStartDate: formattedToday,
      vacationEndDate,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'vacationStartDate') {
      const newEndDate = new Date(new Date(value).setDate(new Date(value).getDate() + 30))
        .toISOString()
        .split('T')[0];
      setInputs((prev) => ({
        ...prev,
        vacationEndDate: newEndDate,
      }));
    }
  };

  const calculatePayment = () => {
    setError('');

    if (!inputs.basicSalary) {
      setError('Please enter Basic Salary Details!');
      return;
    }

    const allInputsBlank = Object.values(inputs).every((x) => x === '');
    if (allInputsBlank) {
      setError('Please enter Package Details!');
      return;
    }

    const parseInput = (value) => parseFloat(value) || 0;

    const basicSalary = parseInput(inputs.basicSalary);
    const housingAllowance = parseInput(inputs.housingAllowance);
    const transportAllowance = parseInput(inputs.transportAllowance);
    const foodAllowance = parseInput(inputs.foodAllowance);
    const productionBonus = parseInput(inputs.productionBonus);
    const fixedAllowances = parseInput(inputs.fixedAllowances);
    const otherAllowances = parseInput(inputs.otherAllowances);
    const gosi = parseInput(inputs.gosi);

    const startDate = new Date(inputs.salaryFrom);
    const endDate = new Date(inputs.vacationStartDate);
    const workingDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

    const workingDaysSalary =
      (basicSalary / 30) * workingDays +
      housingAllowance +
      (transportAllowance / 30) * workingDays +
      (foodAllowance / 30) * workingDays +
      productionBonus +
      fixedAllowances +
      (otherAllowances / 30) * workingDays;

    const vacationSalary = basicSalary;
    const deductions = gosi;

    let finalWorkingDaysSalary = 0;
    let finalVacationSalary = 0;

    switch (inputs.vacationType) {
      case 'annual':
        finalWorkingDaysSalary = workingDaysSalary;
        finalVacationSalary = vacationSalary;
        break;
      case 'personal':
        finalWorkingDaysSalary = workingDaysSalary;
        break;
      case 'encashment':
        finalVacationSalary = vacationSalary;
        break;
    }

    setResults({
      workingDaysSalary: Math.round(finalWorkingDaysSalary),
      vacationSalary: Math.round(finalVacationSalary),
      deductions: Math.round(deductions),
      totalPayment: Math.round(finalWorkingDaysSalary + finalVacationSalary - deductions),
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Vacation Salary Calculator</h2>
      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="basicSalary">
            Basic Salary *
          </label>
          <input
            style={styles.input}
            id="basicSalary"
            name="basicSalary"
            value={inputs.basicSalary}
            onChange={handleInputChange}
            type="number"
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="housingAllowance">
            Housing Allowance
          </label>
          <input
            style={styles.input}
            id="housingAllowance"
            name="housingAllowance"
            value={inputs.housingAllowance}
            onChange={handleInputChange}
            type="number"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="transportAllowance">
            Transport Allowance
          </label>
          <input
            style={styles.input}
            id="transportAllowance"
            name="transportAllowance"
            value={inputs.transportAllowance}
            onChange={handleInputChange}
            type="number"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="foodAllowance">
            Food Allowance
          </label>
          <input
            style={styles.input}
            id="foodAllowance"
            name="foodAllowance"
            value={inputs.foodAllowance}
            onChange={handleInputChange}
            type="number"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="productionBonus">
            Production Bonus
          </label>
          <input
            style={styles.input}
            id="productionBonus"
            name="productionBonus"
            value={inputs.productionBonus}
            onChange={handleInputChange}
            type="number"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="fixedAllowances">
            Fixed Allowances
          </label>
          <input
            style={styles.input}
            id="fixedAllowances"
            name="fixedAllowances"
            value={inputs.fixedAllowances}
            onChange={handleInputChange}
            type="number"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="otherAllowances">
            Other Allowances
          </label>
          <input
            style={styles.input}
            id="otherAllowances"
            name="otherAllowances"
            value={inputs.otherAllowances}
            onChange={handleInputChange}
            type="number"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="gosi">
            GOSI
          </label>
          <input
            style={styles.input}
            id="gosi"
            name="gosi"
            value={inputs.gosi}
            onChange={handleInputChange}
            type="number"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="salaryFrom">
            Salary From
          </label>
          <input
            style={styles.input}
            id="salaryFrom"
            name="salaryFrom"
            value={inputs.salaryFrom}
            onChange={handleInputChange}
            type="date"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="vacationStartDate">
            Vacation Start Date
          </label>
          <input
            style={styles.input}
            id="vacationStartDate"
            name="vacationStartDate"
            value={inputs.vacationStartDate}
            onChange={handleInputChange}
            type="date"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="vacationEndDate">
            Vacation End Date
          </label>
          <input
            style={styles.input}
            id="vacationEndDate"
            name="vacationEndDate"
            value={inputs.vacationEndDate}
            onChange={handleInputChange}
            type="date"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="vacationType">
            Vacation Type
          </label>
          <select
            style={styles.select}
            id="vacationType"
            name="vacationType"
            value={inputs.vacationType}
            onChange={handleInputChange}
          >
            <option value="annual">Annual Vacation</option>
            <option value="personal">Personal Vacation</option>
            <option value="encashment">Encashment</option>
          </select>
        </div>
      </div>

      <button style={styles.button} onClick={calculatePayment}>
        Calculate Payment
      </button>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.results}>
        <div style={styles.resultsTitle}>Results</div>
        <div style={styles.resultItem}>
          <strong>Working Days Salary:</strong> {results.workingDaysSalary}
        </div>
        <div style={styles.resultItem}>
          <strong>Vacation Salary:</strong> {results.vacationSalary}
        </div>
        <div style={styles.resultItem}>
          <strong>Deductions:</strong> {results.deductions}
        </div>
        <div style={styles.resultItem}>
          <strong>Total Payment:</strong> {results.totalPayment}
        </div>
      </div>
    </div>
  );
};

export default VacationSalaryCalculator;
