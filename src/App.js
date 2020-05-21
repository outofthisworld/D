import React from "react";
import "./styles.css";

const InputWithLabel = ({ label, id, customInputElement, ...rest }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      width: "100%"
    }}
  >
    <label
      for={id}
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 16,
        whiteSpace: "no-wrap",
        minWidth: "30%"
      }}
    >
      {label}
    </label>
    {customInputElement || (
      <input
        {...rest}
        style={{
          flex: 1,
          maxWidth: "55%",
          borderRadius: 0,
          padding: 5,
          paddingTop: 10,
          paddingBottom: 10,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: "#000",
          fontSize: 16,
          backgroundColor: "transparent"
        }}
      />
    )}
  </div>
);

const InputContainer = ({ children, style }) => (
  <div
    style={{
      marginTop: 10,
      paddingTop: 10,
      paddingBottom: 10,
      width: "100%",
      maxWidth: "100%",
      ...(style || {})
    }}
  >
    {children}
  </div>
);

const Calcualtor = ({ title }) => {
  const [managementFeeValue, setManagementFeeValue] = React.useState(3);
  const [rentPerWeek, setRentPerWeek] = React.useState(null);
  const [projectedRentPerWeek, setProjectedRentPerWeek] = React.useState(null);

  const [calculatedValues, setCalculatedValues] = React.useState(null);

  const [inputError, setInputError] = React.useState(false);

  const onChangeManagementFee = React.useCallback(event => {
    setManagementFeeValue(event.target.value);
  }, []);

  const onChangeRentPerWeek = React.useCallback(e => {
    setRentPerWeek(e.target.value);
  }, []);

  const onChangeProjectedRentPerWeek = React.useCallback(e => {
    setProjectedRentPerWeek(e.target.value);
  }, []);

  const onCalculate = React.useCallback(() => {
    console.log("calculating");
    setInputError(false);
    try {
      if (isNaN(Number(rentPerWeek)) || isNaN(Number(projectedRentPerWeek))) {
        return setInputError(true);
      }

      if (Number(rentPerWeek) === 0 || Number(projectedRentPerWeek) === 0) {
        return setInputError(true);
      }

      const rentPw = Number(rentPerWeek);
      const projectedRentPw = Number(projectedRentPerWeek);
      const mFeeValue = Number(managementFeeValue);

      const rentDifference = projectedRentPw - rentPw;
      const rentIncreasePercentage = (projectedRentPw / rentPw - 1) * 100;
      const allhouseManagementFeePerWeek = rentPw * (mFeeValue / 100);
      const typicalManagementFeePerWeek = rentPw * 0.08;
      const investorProfitSharePercentage = mFeeValue / 10;
      const investorGrossEarnings =
        rentDifference * investorProfitSharePercentage;
      const investorNetEarnings =
        investorGrossEarnings - allhouseManagementFeePerWeek;

      const investorNetEarningsInclRent = investorNetEarnings + rentPw;

      const investorNetTypical = rentPw - typicalManagementFeePerWeek;
      const investorSavings = investorNetEarningsInclRent - investorNetTypical;
      const calculations = {
        rentPw,
        projectedRentPw,
        mFeeValue,
        rentDifference,
        rentIncreasePercentage,
        allhouseManagementFeePerWeek,
        typicalManagementFeePerWeek,
        investorProfitSharePercentage,
        investorGrossEarnings,
        investorNetEarnings,
        investorNetEarningsInclRent,
        investorNetTypical,
        investorSavings
      };

      Object.entries(calculations).forEach(([key, val]) => {
        calculations[key] =
          (typeof calculations[key] === "number" && val.toFixed(2)) ||
          calculations[key];
      });

      setCalculatedValues(calculations);
    } catch (err) {
      console.log(err);
    }
  }, [rentPerWeek, projectedRentPerWeek, managementFeeValue]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rentPw = urlParams.get("rentPw");
    const projetedRentPw = urlParams.get("projectedRentPw");

    const nRentPw = Number(rentPw);
    const nProjectedRentPw = Number(projetedRentPw);

    if (typeof nRentPw === "number") {
      setRentPerWeek(nRentPw);
    }

    if (typeof nProjectedRentPw === "number") {
      setProjectedRentPerWeek(nProjectedRentPw);
    }
  }, []);

  React.useEffect(() => {
    if (rentPerWeek && projectedRentPerWeek) onCalculate();
  }, [rentPerWeek, projectedRentPerWeek, onCalculate]);

  const onClear = React.useCallback(() => {
    setCalculatedValues(null);
  }, []);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        textAlign: "center",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10
      }}
      className={"calculator"}
    >
      <h1 style={{ fontSize: 22 }}>{title}</h1>
      {(inputError && (
        <span style={{ color: "red", textAlign: "center" }}>
          Please make sure all inputs are valid.
        </span>
      )) ||
        null}
      <form style={{ width: "100%", marginTop: 10 }}>
        <InputContainer>
          <InputWithLabel
            placeholder={"1200"}
            type="number"
            label={"Rent (P/W)"}
            id={"rentPw"}
            value={rentPerWeek}
            onChange={onChangeRentPerWeek}
          />
        </InputContainer>
        <InputContainer>
          <InputWithLabel
            placeholder={"1500"}
            label={"Projected Rent (P/W)"}
            id={"projectRentPw"}
            onChange={onChangeProjectedRentPerWeek}
            value={projectedRentPerWeek}
          />
        </InputContainer>
        <InputContainer>
          <InputWithLabel
            customInputElement={
              <select
                style={{
                  width: "100%",
                  padding: 20,
                  display: "block",
                  boxSizing: "content-box",
                  fontSize: 16,
                  backgroundColor: "#fff",
                  borderWidth: 0
                }}
                onChange={onChangeManagementFee}
                value={managementFeeValue}
              >
                <option value={3}>3% Management Fee</option>
                <option value={5}>5% Management Fee</option>
                <option value={8}>8% Management Fee</option>
              </select>
            }
            placeholder={"1500"}
            label={"Management Fee"}
            id={"rentPw"}
          />
        </InputContainer>
        <InputContainer>
          <InputWithLabel
            customInputElement={
              <select
                style={{
                  width: "100%",
                  padding: 20,
                  display: "block",
                  boxSizing: "content-box",
                  fontSize: 16,
                  backgroundColor: "#fff",
                  borderWidth: 0
                }}
                value={managementFeeValue}
                disabled
              >
                <option value={3}>30/70 split</option>
                <option value={5}>50/50 split</option>
                <option value={8}>80/20 split</option>
              </select>
            }
            placeholder={"1500"}
            label={"Profit Share %"}
            id={"rentPw"}
          />
        </InputContainer>
        {calculatedValues && (
          <div>
            <table
              style={{ paddingTop: 10, paddingBottom: 10 }}
              className={"allhouseTable"}
            >
              <thead>
                <tr>
                  <td>Item</td>
                  <td>Allhouse</td>
                  <td>Typical property management</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rent per week</td>
                  <td>${projectedRentPerWeek}</td>
                  <td>${rentPerWeek}</td>
                </tr>
                <tr>
                  <td>Rent increase percentage</td>
                  <td>{calculatedValues.rentIncreasePercentage}%</td>
                  <td>0%</td>
                </tr>
                <tr>
                  <td>Rent increase amount</td>
                  <td>${calculatedValues.rentDifference}</td>
                  <td>$0</td>
                </tr>
                <tr>
                  <td>Management Fee Cost (P/W)</td>
                  <td>${calculatedValues.allhouseManagementFeePerWeek}</td>
                  <td>${calculatedValues.typicalManagementFeePerWeek}</td>
                </tr>
                <tr>
                  <td>Investor Profit Share</td>
                  <td>${calculatedValues.investorGrossEarnings}</td>
                  <td>$0</td>
                </tr>
                <tr>
                  <td>Investor Net Earnings</td>
                  <td>${calculatedValues.investorNetEarnings}</td>
                  <td>-${calculatedValues.typicalManagementFeePerWeek}</td>
                </tr>
                <tr>
                  <td>Investor Net Earnings P/W (incl rent)</td>
                  <td>${calculatedValues.investorNetEarningsInclRent}</td>
                  <td>
                    $
                    {Number(rentPerWeek) -
                      calculatedValues.typicalManagementFeePerWeek}
                  </td>
                </tr>
                <tr>
                  <td>Potential investor savings (P/W)</td>
                  <td>${calculatedValues.investorSavings}</td>
                  <td>$0</td>
                </tr>
                <tr>
                  <td>Potential investor savings (P/A)</td>
                  <td>${calculatedValues.investorSavings * 52}</td>
                  <td>$0</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <InputContainer style={{ marginTop: 20 }}>
          <input
            type="button"
            value="Clear"
            style={{
              boxSizing: "content-box",
              padding: 10,
              fontSize: 16,
              display: "inline-block",
              backgroundColor: "red",
              color: "#fff",
              borderRadius: 5,
              borderColor: "#fff"
            }}
            onClick={onClear}
          />
          <input
            type="button"
            value="Calculate"
            style={{
              boxSizing: "content-box",
              padding: 10,
              fontSize: 16,
              marginLeft: 5,
              display: "inline-block",
              backgroundColor: "transparent",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#f3f3f3"
            }}
            onClick={onCalculate}
          />
        </InputContainer>
      </form>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Calcualtor title={"Allhouse Investor Calculator"} />
    </div>
  );
}
