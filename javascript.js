"use strict";


// =========================================================
// PRECOIN
// Bitcoin / Crypto Decision Check
// Google Ads Validation Version
//
// VERSION:
// maxLoss integrated
// =========================================================


const form =
  document.getElementById("precoinForm");

const successBox =
  document.getElementById("formSuccess");


// =========================================================
// 1. PLAUSIBLE ANALYTICS — PRECOIN FUNNEL
// =========================================================
//
// "Check Started":
// Nutzer interagiert erstmals tatsächlich
// mit dem Decision-Formular.
//
// Funnel:
//
// Landingpage
// ↓
// echter Formularstart
// ↓
// Check Completed
//
// =========================================================


let checkStartedTracked = false;


function trackCheckStarted() {

  if (checkStartedTracked) {
    return;
  }


  checkStartedTracked = true;


  if (
    typeof window.plausible ===
    "function"
  ) {

    window.plausible(
      "Check Started"
    );

  }


  console.log(
    "PRECOIN analytics: Check Started"
  );

}


// =========================================================
// 2. ECHTE FORMULARINTERAKTION ERKENNEN
// =========================================================


form.addEventListener(
  "focusin",
  trackCheckStarted
);


form.addEventListener(
  "input",
  trackCheckStarted
);


form.addEventListener(
  "change",
  trackCheckStarted
);


// =========================================================
// 3. FORMULAR ABSENDEN
// =========================================================


form.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    // =====================================================
    // 4. FORMULARWERTE LESEN
    // =====================================================


    const asset =
      document
        .getElementById("asset")
        .value
        .trim();


    const amount =
      Number(
        document
          .getElementById("amount")
          .value
      );


    const portfolioValue =
      Number(
        document
          .getElementById(
            "portfolioValue"
          )
          .value
      );


    const currentCryptoValue =
      Number(
        document
          .getElementById(
            "currentCryptoValue"
          )
          .value
      );


    const maxCryptoAllocation =
      Number(
        document
          .getElementById(
            "maxCryptoAllocation"
          )
          .value
      );


    // =====================================================
    // NEU:
    // MAXIMAL TOLERIERTER TEMPORÄRER VERLUST
    // =====================================================


    const maxLoss =
      Number(
        document
          .getElementById(
            "maxLoss"
          )
          .value
      );


    const timeHorizon =
      document
        .getElementById(
          "timeHorizon"
        )
        .value;


    const reason =
      document
        .getElementById(
          "reason"
        )
        .value
        .trim();


    const exitRule =
      document
        .getElementById(
          "exitRule"
        )
        .value
        .trim();


    // =====================================================
    // 5. PLAUSIBILITÄT PRÜFEN
    // =====================================================


    if (!asset) {

      alert(
        "Please enter a crypto asset."
      );

      return;

    }


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      alert(
        "Please enter a valid investment amount."
      );

      return;

    }


    if (
      !Number.isFinite(portfolioValue) ||
      portfolioValue <= 0
    ) {

      alert(
        "Please enter a valid total portfolio value."
      );

      return;

    }


    if (
      !Number.isFinite(
        currentCryptoValue
      ) ||
      currentCryptoValue < 0
    ) {

      alert(
        "Please enter a valid current crypto value."
      );

      return;

    }


    if (
      currentCryptoValue >
      portfolioValue
    ) {

      alert(
        "Your current crypto value cannot be higher than your total portfolio value."
      );

      return;

    }


    if (
      !Number.isFinite(
        maxCryptoAllocation
      ) ||
      maxCryptoAllocation <= 0 ||
      maxCryptoAllocation > 100
    ) {

      alert(
        "Your maximum crypto allocation must be between 1% and 100%."
      );

      return;

    }


    // =====================================================
    // NEU:
    // MAX LOSS VALIDIEREN
    // =====================================================


    if (
      !Number.isFinite(maxLoss) ||
      maxLoss < 0 ||
      maxLoss > 100
    ) {

      alert(
        "Your maximum temporary loss must be between 0% and 100%."
      );

      return;

    }


    if (!timeHorizon) {

      alert(
        "Please select your investment horizon."
      );

      return;

    }


    if (!reason) {

      alert(
        "Please explain why you want to make this investment now."
      );

      return;

    }


    if (!exitRule) {

      alert(
        "Please enter your exit or rebalancing rule."
      );

      return;

    }


    // =====================================================
    // 6. PORTFOLIO / ALLOKATION BERECHNEN
    // =====================================================


    const currentAllocation =
      (
        currentCryptoValue /
        portfolioValue
      ) * 100;


    const portfolioAfterPurchase =
      portfolioValue + amount;


    const cryptoAfterPurchase =
      currentCryptoValue + amount;


    const allocationAfterPurchase =
      (
        cryptoAfterPurchase /
        portfolioAfterPurchase
      ) * 100;


    // =====================================================
    // 7. NEU — VERLUSTTOLERANZ BERECHNEN
    // =====================================================
    //
    // Beispiel:
    //
    // Kauf = €2.000
    // maxLoss = 30%
    //
    // → €600 Verlust auf den geplanten Kauf.
    //
    // Wir behaupten NICHT,
    // dass Bitcoin tatsächlich 30% fällt.
    //
    // Wir zeigen nur,
    // was die vom Nutzer selbst eingegebene
    // Verlustgrenze in Euro bedeutet.
    //
    // =====================================================


    const maxLossAmount =
      amount *
      (
        maxLoss /
        100
      );


    const portfolioImpactAtMaxLoss =
      (
        maxLossAmount /
        portfolioAfterPurchase
      ) * 100;


    // =====================================================
    // 8. REGELVERLETZUNGEN SAMMELN
    // =====================================================


    const issues = [];

    const passedRules = [];


    // -----------------------------------------------------
    // REGEL 1
    // Maximale Crypto-Allokation
    // -----------------------------------------------------


    if (
      allocationAfterPurchase >
      maxCryptoAllocation
    ) {

      issues.push({

        title:
          "Crypto allocation exceeded",

        text:
          `This purchase would increase your crypto allocation ` +
          `from ${currentAllocation.toFixed(1)}% to ` +
          `${allocationAfterPurchase.toFixed(1)}%. ` +
          `Your maximum is ${maxCryptoAllocation}%.`

      });

    } else {

      passedRules.push({

        title:
          "Crypto allocation",

        text:
          `Your allocation after this purchase would be ` +
          `${allocationAfterPurchase.toFixed(1)}%, ` +
          `below your ${maxCryptoAllocation}% maximum.`

      });

    }


    // -----------------------------------------------------
    // REGEL 2
    // Exit-Plan
    // -----------------------------------------------------


    if (
      exitRule.length < 15
    ) {

      issues.push({

        title:
          "Exit rule unclear",

        text:
          "Your exit or rebalancing rule is very short or undefined."

      });

    } else {

      passedRules.push({

        title:
          "Exit rule defined",

        text:
          "You entered a predefined condition for selling, reducing or rebalancing."

      });

    }


    // -----------------------------------------------------
    // REGEL 3
    // Kurzfristiger Anlagehorizont
    // -----------------------------------------------------


    if (
      timeHorizon ===
      "less-than-1-year"
    ) {

      issues.push({

        title:
          "Short investment horizon",

        text:
          "You selected an investment horizon of less than one year. " +
          "Short horizons can make volatile crypto positions harder to tolerate."

      });

    } else {

      passedRules.push({

        title:
          "Investment horizon",

        text:
          "You entered a multi-year investment horizon."

      });

    }


    // -----------------------------------------------------
    // REGEL 4
    // Verlusttoleranz
    // -----------------------------------------------------
    //
    // Wichtig:
    //
    // PRECOIN bewertet hier NICHT,
    // welcher Verlust bei Bitcoin normal ist.
    //
    // Es übersetzt lediglich
    // die selbst gewählte Grenze
    // in einen konkreten Eurobetrag.
    //
    // -----------------------------------------------------


    if (
      maxLoss === 0
    ) {

      issues.push({

        title:
          "No temporary loss tolerance",

        text:
          "You entered a maximum temporary loss tolerance of 0%. " +
          "Any temporary decline in the planned position would exceed that limit."

      });

    } else {

      passedRules.push({

        title:
          "Loss tolerance defined",

        text:
          `You entered a maximum temporary loss tolerance of ` +
          `${maxLoss}%. On a €${formatMoney(amount)} planned purchase, ` +
          `that equals approximately €${formatMoney(maxLossAmount)}.`

      });

    }


    // =====================================================
    // 9. EINFACHE FOMO-SPRACHERKENNUNG
    // =====================================================


    const reasonLower =
      reason.toLowerCase();


    const fomoWords = [

      "miss",
      "missing",
      "fomo",
      "everyone",
      "going up",
      "pump",
      "moon",
      "too late",
      "recovery",
      "dip",
      "cheap",
      "quick profit"

    ];


    const detectedFomoWords =
      fomoWords.filter(
        function (word) {

          return reasonLower.includes(
            word
          );

        }
      );


    if (
      detectedFomoWords.length > 0
    ) {

      issues.push({

        title:
          "Possible emotional trigger",

        text:
          `Your reason contains language associated with reactive ` +
          `or momentum-driven decisions: ` +
          detectedFomoWords.join(", ") +
          `.`

      });

    } else {

      passedRules.push({

        title:
          "No obvious FOMO language detected",

        text:
          "Your stated reason does not contain one of PRECOIN's basic FOMO trigger phrases."

      });

    }


    // =====================================================
    // 10. RISIKOSTUFE BERECHNEN
    // =====================================================


    let riskLevel =
      "LOW";


    if (
      issues.length >= 3
    ) {

      riskLevel =
        "HIGH";

    } else if (
      issues.length >= 1
    ) {

      riskLevel =
        "CAUTION";

    }


    // =====================================================
    // 11. ENTSCHEIDUNG ERSTELLEN
    // =====================================================


    const decision = {

      asset,

      amount,

      portfolioValue,

      currentCryptoValue,

      maxCryptoAllocation,

      maxLoss,


      maxLossAmount:
        Number(
          maxLossAmount.toFixed(2)
        ),


      portfolioImpactAtMaxLoss:
        Number(
          portfolioImpactAtMaxLoss
            .toFixed(2)
        ),


      currentAllocation:
        Number(
          currentAllocation
            .toFixed(1)
        ),


      allocationAfterPurchase:
        Number(
          allocationAfterPurchase
            .toFixed(1)
        ),


      timeHorizon,

      reason,

      exitRule,

      issues,

      passedRules,

      riskLevel,


      createdAt:
        new Date().toISOString()

    };


    // =====================================================
    // 12. LOKAL SPEICHERN
    // =====================================================


    localStorage.setItem(
      "precoin_last_decision",
      JSON.stringify(decision)
    );


    console.log(
      "PRECOIN decision submitted:",
      decision
    );


    // =====================================================
    // 13. PLAUSIBLE — CHECK COMPLETED
    // =====================================================


    if (
      typeof window.plausible ===
      "function"
    ) {

      window.plausible(
        "Check Completed"
      );

    }


    console.log(
      "PRECOIN analytics: Check Completed"
    );


    // =====================================================
    // 14. ISSUE HTML ERSTELLEN
    // =====================================================


    const issueHTML =

      issues.length === 0

        ? `

          <div class="mini-result mini-success">

            <strong>
              No rule conflicts detected.
            </strong>

          </div>

        `

        : issues
            .map(
              function (issue) {

                return `

                  <div class="mini-result mini-warning">

                    <strong>
                      ⚠ ${escapeHTML(issue.title)}
                    </strong>

                    <p>
                      ${escapeHTML(issue.text)}
                    </p>

                  </div>

                `;

              }
            )
            .join("");


    // =====================================================
    // 15. PASSED RULES HTML
    // =====================================================


    const passedHTML =

      passedRules
        .map(
          function (rule) {

            return `

              <div class="mini-result mini-success">

                <strong>
                  ✓ ${escapeHTML(rule.title)}
                </strong>

                <p>
                  ${escapeHTML(rule.text)}
                </p>

              </div>

            `;

          }
        )
        .join("");


    // =====================================================
    // 16. FORMULAR AUSBLENDEN
    // =====================================================


    form.hidden =
      true;


    successBox.hidden =
      false;


    // =====================================================
    // 17. PRECOIN REPORT ZEIGEN
    // =====================================================


    successBox.innerHTML = `

      <div class="generated-report">

        <p class="section-label">
          PRECOIN DECISION CHECK
        </p>


        <h3>

          ${escapeHTML(asset)}
          —
          €${formatMoney(amount)}

        </h3>


        <div
          class="
            generated-risk
            generated-risk-${riskLevel.toLowerCase()}
          "
        >

          <span>
            DECISION RISK
          </span>

          <strong>
            ${riskLevel}
          </strong>

        </div>


        <div class="generated-summary">


          <div>

            <span>
              Current crypto allocation
            </span>

            <strong>
              ${currentAllocation.toFixed(1)}%
            </strong>

          </div>


          <div>

            <span>
              After planned purchase
            </span>

            <strong>
              ${allocationAfterPurchase.toFixed(1)}%
            </strong>

          </div>


          <div>

            <span>
              Your maximum
            </span>

            <strong>
              ${maxCryptoAllocation}%
            </strong>

          </div>


        </div>


        <!-- ===============================================
             NEW:
             LOSS TOLERANCE SCENARIO
        ================================================ -->

        <div class="generated-conclusion">

          <strong>
            Your temporary loss limit:
            ${maxLoss}%
          </strong>

          <p>

            On the planned
            €${formatMoney(amount)}
            purchase,

            a ${maxLoss}% decline
            equals approximately

            <strong>
              €${formatMoney(maxLossAmount)}
            </strong>

            in temporary loss.

            That is approximately
            ${portfolioImpactAtMaxLoss.toFixed(1)}%
            of the portfolio value
            immediately after the planned purchase.

          </p>

        </div>


        <h4 class="generated-heading">
          Issues
        </h4>


        ${issueHTML}


        <h4 class="generated-heading">
          Rules passed
        </h4>


        ${passedHTML}


        <div class="generated-reason">

          <span>
            YOUR REASON
          </span>

          <blockquote>
            “${escapeHTML(reason)}”
          </blockquote>

        </div>


        <div class="generated-exit">

          <span>
            YOUR EXIT / REBALANCING RULE
          </span>

          <p>
            ${escapeHTML(exitRule)}
          </p>

        </div>


        <div class="generated-conclusion">

          <strong>

            ${issues.length}

            issue${issues.length === 1 ? "" : "s"}

            detected before the decision.

          </strong>


          <p>

            PRECOIN is not predicting whether
            ${escapeHTML(asset)}
            will rise or fall.

            It is checking whether this planned decision
            conflicts with the portfolio limits,
            loss tolerance,
            time horizon,
            exit rules
            and reasoning you entered.

          </p>

        </div>


        <button
          type="button"
          id="newDecisionButton"
          class="primary-button form-button"
        >
          Check another decision
        </button>


      </div>

    `;


    // =====================================================
    // 18. NEUE ENTSCHEIDUNG
    // =====================================================


    const newDecisionButton =
      document.getElementById(
        "newDecisionButton"
      );


    newDecisionButton.addEventListener(
      "click",
      function () {


        form.reset();


        successBox.hidden =
          true;


        form.hidden =
          false;


        checkStartedTracked =
          false;


        document
          .getElementById(
            "decision-check"
          )
          .scrollIntoView({

            behavior:
              "smooth"

          });


      }
    );


  }
);


// =========================================================
// 19. GELDBETRÄGE FORMATIEREN
// =========================================================


function formatMoney(value) {

  return Number(value)
    .toLocaleString(
      "en-US",
      {

        maximumFractionDigits:
          2

      }
    );

}


// =========================================================
// 20. HTML SICHER AUSGEBEN
// =========================================================


function escapeHTML(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}