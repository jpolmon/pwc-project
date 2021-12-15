// Questions
const questions = [
	// Q1
	{
		template: "How many sales orders were not %S in %M?",
		calculateAnswer: function(s, m){
			// Find the columns in the master data for the status and month
			const statusCol = getNumForColumn("Status");
			const monthCol = getNumForColumn("Month");

			// Convert the month into a number
			const monthToNum = {
				january: 1,
				february: 2,
				march: 3,
				april: 4,
				may: 5,
				june: 6,
				july: 7,
				august: 8,
				september: 9,
				october: 10,
				november: 11,
				december: 12
			};

			// From the master data's orders
			return [masterData.orders
			// Keep sales orders from the month that aren't the same satatus
			.filter(order => order[monthCol] == monthToNum[m.toLowerCase()] && order[statusCol] !== s)
			// Count them
			.length];
		}
	},
	// Q2
	{
		template: "Which month had the highest percentage of sales orders paid by %PT?",
		calculateAnswer: function(pt){
			const pmtMethodCol = getNumForColumn("Method of payment" );
			const monthCol = getNumForColumn("Month");

			// Convert the month into a number
			const monthToNum = {
				january: 1,
				february: 2,
				march: 3,
				april: 4,
				may: 5,
				june: 6,
				july: 7,
				august: 8,
				september: 9,
				october: 10,
				november: 11,
				december: 12
			};

			// Track each months total orders
			const monthlyTotalOrders = [0,0,0,0,0,0,0,0,0,0,0,0];

			// Track each months orders
			const monthlyOrdersOfPT = [0,0,0,0,0,0,0,0,0,0,0,0];

			// For each order
			masterData.orders.forEach(order => {
				// Get this order's month
				const month = order[monthCol];
				
				// Add one to that month's total count
				monthlyTotalOrders[month]++;
				
				// If the payment method is correct
				if (order[pmtMethodCol] == pt){
					
					// Add one to that month's PT count
					monthlyOrdersOfPT[month]++;
				}
			});

			// Find the highest month
			let highestVal = -1;
			let highestMonth = "";
			// Go through each month
			for (month in monthlyOrdersOfPT){
				// If this month's percentage is the highest one so far
				if (monthlyOrdersOfPT[month] / monthlyTotalOrders[month] > highestVal){
					// Update the counts and month
					highestVal = monthlyOrdersOfPT[month] / monthlyTotalOrders[month];
					highestMonth = month;
				}
			}

			// Return the name of the month
			// For each
			for (month in monthToNum){
				// If the month number is the same
				if (monthToNum[month] == highestMonth){
					// Return the name of the month
					return [month];
				}
			}

			// Otherwise, return none
			return ["none"];
		}
	},
	// Q3
	{
		template: "What was %CN's total sales orders during the first quarter? How many of those sales orders were %S?",
		calculateAnswer: function(cn, s){
			// Get the column numbers
			const cnCol = getNumForColumn("Customer Name");
			const qtrCol = getNumForColumn("Quarter");
			const statusCol = getNumForColumn("Status");

			// From orders
			const orders = masterData.orders
			// Only keep if same customer and in first quarter
			.filter(order => order[cnCol] == cn && order[qtrCol] == "Quarter 1");

			// Add first answer
			let result = [orders.length];

			// add the number of orders that are the correct status
			result.push(
				// From the orders
				orders
				// Keep the ones with the correct status
				.filter(order => order[statusCol] == s)
				// Count them
				.length
			);

			return result;

		}
	},
	// Q4
	{
		template: "How many customer's had %ML than %CCPT&percnt; of their total sales orders paid by some form of credit card?",
		//template: "Which customer had the lowest total percent of sales that were paid with a form of credit card compared to other payment types?",
		calculateAnswer: function(ml, ccpt){
			// Convert the credit card percentage to a number
			ccpt = +ccpt;

			// Get the columns we need
			const cnCol = getNumForColumn("Customer Name");
			const ccCol = getNumForColumn("Credit Card"); // "Other" or "Credit Card"

			// Create matches function based on whether we want more or less than the threshold
			const matches = ml == "More" ? (pct) => pct > ccpt : (pct) => pct < ccpt;

			const CCByCustomer = {};
			const totalByCustomer = {};

			masterData.orders.forEach(order => {
				// Get customer name
				const name = order[cnCol];
				const cc = order[ccCol];

				// If customer not in the objects yet
				if (!CCByCustomer.hasOwnProperty(name)){
					// Add them
					CCByCustomer[name] = 0;
					totalByCustomer[name] = 0;
				}

				// Add one to this customer's total count
				totalByCustomer[name]++;

				// add one to this customer's cc count if cc
				CCByCustomer[name] += cc == "Credit Card";
			});

			// Count how many customers
			let count = 0;
			// Go through each name
			for (name in totalByCustomer){
				// Calculate percentage
				const pct = 100 * CCByCustomer[name] / totalByCustomer[name];
				// If that percentage matches our criteria
				if (matches(pct)){
					// Increase the count
					count++;
				}
			}

			// Return the customer
			return [count];

		}
	},
	// Q5
	{
		template: "How many orders between $%SA and $%SA were placed by corporations (containing \"corp\" in the Customer Name)?",
		calculateAnswer: function(sa1, sa2){
			// Get all the columns we'll need to use
			const cnCol = getNumForColumn("Customer Name");
			const monthCol = getNumForColumn("Month");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Make sure sa1 and sa2 are numbers
			sa1 = parseToNumber(sa1);
			sa2 = parseToNumber(sa2);

			// Keep track of total sales amount
			let totalSalesAmount = 0;
			// Keep track of total sales order count
			let totalSalesCount = 0;
			// Keep track of total sales amount by month
			const salesAmountsByMonth = {};

			// In the orders
			const result = masterData.orders
			// Find the orders for customers with the sub-string "corp" in their name and the sales amounts in the range
			.filter(order => order[cnCol].toLowerCase().indexOf("corp") != -1 && +order[salesAmountCol] > sa1 && +order[salesAmountCol] < sa2)
			// Get the number of orders
			.length;

			return [result];
		}
	},
	// Q6
	{
		template: "Which customer in %IS, paying by %PT, had the highest cumulative sales amount from orders that occurred during the last 5 days of %M?",
		calculateAnswer: function(is, pt, m){
			// Get the columns we'll need to use
			const isCol = getNumForColumn("Industry Sector");
			const daysInMonthCol = getNumForColumn("Days of Month"); // Days in month
			const dayOfMonthCol = getNumForColumn("Day");
			const ptCol = getNumForColumn("Method of payment");
			const mCol = getNumForColumn("Month");
			const customerCol = getNumForColumn("Customer Name");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Convert month m into a number
			const monthToNum = {
				january: 1,
				february: 2,
				march: 3,
				april: 4,
				may: 5,
				june: 6,
				july: 7,
				august: 8,
				september: 9,
				october: 10,
				november: 11,
				december: 12
			};
			m = monthToNum[m.toLowerCase()];
			
			// Map to store each customer's sales
			cumulativeSalesAmountByCustomer = {};

			// For each order
			masterData.orders
			// Only keep orders with the correct industry sector, Payment type, month, and day is last five
			.filter(order => {
				const cuttoffDay = +order[daysInMonthCol] - 5;
				return order[isCol] == is &&
				order[ptCol] == pt &&
				order[mCol] == m &&
				order[dayOfMonthCol] >= cuttoffDay;
			})
			// For each of the remaining orders
			.forEach(order => {
				// Find the customer
				const customer = order[customerCol];

				// If the customer hasn't been registered yet
				if (!cumulativeSalesAmountByCustomer.hasOwnProperty(customer)){
					// add it
					cumulativeSalesAmountByCustomer[customer] = 0;
				}

				// Add the sales amount to this customer's sum (cast as number)
				cumulativeSalesAmountByCustomer[customer] += +order[salesAmountCol];
			});

			// Find the greatest sales amount
			let highestSalesAmount = -1;
			let highestCustomer = "none";
			// For each customer
			for (customer in cumulativeSalesAmountByCustomer){
				// If they have a higher sum
				if (cumulativeSalesAmountByCustomer[customer] > highestSalesAmount){
					// Update the highest ones
					highestSalesAmount = cumulativeSalesAmountByCustomer[customer];
					highestCustomer = customer;
				}
			}

			return [highestCustomer];
		}
	},
	// Q7
	{
		template: "Which customer in %IS, paying by %PT, had the highest cumulative sales amount from orders that occurred during the last 10 days of %Q?",
		calculateAnswer: function(is, pt, q){
			// Get the columns we'll need to use
			const isCol = getNumForColumn("Industry Sector");
			const daysInMonthCol = getNumForColumn("Days of Month"); // Days in month
			const dayOfMonthCol = getNumForColumn("Day");
			const ptCol = getNumForColumn("Method of payment");
			const mCol = getNumForColumn("Month");
			const customerCol = getNumForColumn("Customer Name");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Convert quarter number to last month of that quarter
			const lastMonthOfQtr = {
				"Quarter 1": 3, // March
				"Quarter 2": 6, // June
				"Quarter 3": 9, // September
				"Quarter 4": 12,// December
			}
			const m = lastMonthOfQtr[q];
			
			// Map to store each customer's sales
			cumulativeSalesAmountByCustomer = {};

			// For each order
			masterData.orders
			// Only keep orders with the correct industry sector, Payment type, month (last of quarter), and day is last ten
			.filter(order => {
				const cuttoffDay = +order[daysInMonthCol] - 10;
				return order[isCol] == is &&
				order[ptCol] == pt &&
				order[mCol] == m &&
				order[dayOfMonthCol] >= cuttoffDay;
			})
			// For each of the remaining orders
			.forEach(order => {
				// Find the customer
				const customer = order[customerCol];

				// If the customer hasn't been registered yet
				if (!cumulativeSalesAmountByCustomer.hasOwnProperty(customer)){
					// add it
					cumulativeSalesAmountByCustomer[customer] = 0;
				}

				// Add the sales amount to this customer's sum (cast as number)
				cumulativeSalesAmountByCustomer[customer] += +order[salesAmountCol];
			});

			// Find the greatest sales amount
			let highestSalesAmount = -1;
			let highestCustomer = "none";
			// For each customer
			for (customer in cumulativeSalesAmountByCustomer){
				// If they have a higher sum
				if (cumulativeSalesAmountByCustomer[customer] > highestSalesAmount){
					// Update the highest ones
					highestSalesAmount = cumulativeSalesAmountByCustomer[customer];
					highestCustomer = customer;
				}
			}

			return [highestCustomer];
		}
	},
	// Q8
	{
		template: "How many customers make up the top %X percent of %IS customers by number of sales orders?",
		calculateAnswer: function(x, is){
			// Get the columns we'll need to use
			const isCol = getNumForColumn("Industry Sector");
			const customerCol = getNumForColumn("Customer Name");
			
			// Map of each customer's sales counts
			const salesOrdersCountByCustomer = {};
			let totalSalesOrders = 0;

			// For each order
			masterData.orders
			// Only keep orders with the correct industry sector
			.filter(order => order[isCol] == is)
			// For each of the remaining orders
			.forEach(order => {
				// Find the customer
				const customer = order[customerCol];

				// If the customer hasn't been registered yet
				if (!salesOrdersCountByCustomer.hasOwnProperty(customer)){
					// add it
					salesOrdersCountByCustomer[customer] = 0;
				}

				// Increment the sales order count for this customer
				salesOrdersCountByCustomer[customer]++;
				// Increment total sales order count
				totalSalesOrders++;
			});

			// Convert sales count map to ordered list
			let orderedListOfSales = [];
			// For each customer
			for (customer in salesOrdersCountByCustomer){
				// And add it to the list
				orderedListOfSales.push(salesOrdersCountByCustomer[customer])
			}

			// Sort list greatest to least
			orderedListOfSales = orderedListOfSales.sort((a, b) => {
				return b - a;
			})

			// Calculate top % sum needed
			// Use ceiling because you need another sale to gain a fraction
			const threshold = Math.ceil(totalSalesOrders * (x / 100.0));

			let rollingSum = 0;
			let customerCount = 0;
			// While we haven't hit that threshold and we still have customers on the list
			while (rollingSum < threshold && customerCount < orderedListOfSales.length - 1){
				// Add more customers to that sum
				rollingSum += orderedListOfSales[customerCount];
				customerCount++;
			}

			return [customerCount];
		}
	},
	// Q9
	{
		template: "For company %C, which primary industry had the highest deviation from their average sales amount (Postive or negative)?",
		calculateAnswer: function(c){
			// Get the columns for the data we need
			const piCol = getNumForColumn("Primary Industry");
			const cCol = getNumForColumn("Company");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Variables to store our data
			const allSalesAmounts = [];
			const salesAmountsByPI = {};

			// Keep the orders for this company
			masterData.orders.filter(order => order[cCol] == c)
			// For each order
			.forEach(order => {
				// add the sales amount to the all array
				// Make sure to convert it to a number
				allSalesAmounts.push(+order[salesAmountCol]);

				const pi = order[piCol];
				// If Primary industry isn't registered yet, add it
				if (!salesAmountsByPI.hasOwnProperty(pi)){
					salesAmountsByPI[pi] = [];
				}

				// add the sales amount to an array for this primary industry
				// Make sure to convert it to a number
				salesAmountsByPI[pi].push(+order[salesAmountCol]);

			});

			// Find the average for all
			// Find the total sum and divide by the total number of sales
			const allAvg = allSalesAmounts.reduce((acc, el) => acc + el, 0) / allSalesAmounts.length;

			let largestDev = -1;
			let targetPI = "none"; // Should always have one, but consistent default
			// For each primary industry
			for (pi in salesAmountsByPI){
				// Find the average
				const avg = salesAmountsByPI[pi].reduce((acc, el) => acc + el, 0) / salesAmountsByPI[pi].length;
				// Find the deviation
				const dev = Math.abs(allAvg - avg);
				// If furthest away so far
				if (dev > largestDev){
					// Record this one
					largestDev = dev;
					targetPI = pi;
				}
			}

			return [targetPI];
		}
	},
	// Q10
	{
		template: "How many customers had at least one sales order with each of the following companies: %C, %C, and %C?",
		calculateAnswer: function(c1, c2, c3){
			// Get the column numbers that we'll need
			const cCol = getNumForColumn("Company");
			const customerCol = getNumForColumn("Customer Name");

			// Keep track of companies by customer
			companiesByCustomer = {};

			// for each order
			masterData.orders.forEach(order => {
				const company = order[cCol];
				const customer = order[customerCol];

				// If customer isn't registered
				if (!companiesByCustomer.hasOwnProperty(customer)){
					// Add it
					companiesByCustomer[customer] = {};
				}

				// If this company isn't registered for this company
				if (!companiesByCustomer[customer].hasOwnProperty(company)){
					// add it
					companiesByCustomer[customer][company] = true;
				}
				// If it has been registered, we're done
			});

			// Keep track of how many customers had sales with all three
			let customerCount = 0;

			// For each customer
			for (customer in companiesByCustomer){
				// Increment if it has all three companies
				// Cast everything as boolean (1 or 0)
				customerCount += !!companiesByCustomer[customer][c1] &&
				!!companiesByCustomer[customer][c2] &&
				!!companiesByCustomer[customer][c3];
			}

			return [customerCount];
		}
	},
	// Q11
	{
		template: "For company %C, which primary industry had the biggest difference between it's highest and lowest sales amount?",
		calculateAnswer: function(c){
			// Get the columns for the data we need
			const piCol = getNumForColumn("Primary Industry");
			const cCol = getNumForColumn("Company");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Variables to store our data
			const salesBordersByPI = {};

			// Keep the orders for this company
			masterData.orders.filter(order => order[cCol] == c)
			// For each order
			.forEach(order => {
				// Get data from order so it's easier to work with
				const pi = order[piCol];
				const amount = +order[salesAmountCol];

				// If Primary industry isn't registered yet, add it
				if (!salesBordersByPI.hasOwnProperty(pi)){
					// Default values to guarantee we get a highest and lowest
					salesBordersByPI[pi] = {
						high: -1,
						low: 9999999999
					};
				}

				// If this sales amount is the highest for this PI
				if (amount > salesBordersByPI[pi].high){
					// Set the new high
					salesBordersByPI[pi].high = amount;
				}
				
				// If this sales amount is the lowest for this PI
				if (amount < salesBordersByPI[pi].low){
					// Set the new low
					salesBordersByPI[pi].low = amount;
				}

			});

			let largestDiff = -1;
			let targetPI = "none"; // Should always have one, but consistent default
			// For each primary industry
			for (pi in salesBordersByPI){
				// Find the deviation
				const diff = salesBordersByPI[pi].high - salesBordersByPI[pi].low;
				// If furthest away so far
				if (diff > largestDiff){
					// Record this one
					largestDiff = diff;
					targetPI = pi;
				}
			}

			return [targetPI];
		}
	},
	// Q12
	{
		template: "How many customers in %I are in the %Percentile percentile of sales orders?",
		calculateAnswer: function(pi, pct){
			// Remove the ordinal text and convert to a number
			pct = +pct.slice(0,-2);

			// Get the columns for the data we need
			const piCol = getNumForColumn("Primary Industry");
			const cnameCol = getNumForColumn("Customer Name");

			// Variables to store our data
			const salesOrdersByCustomer = {};

			// Keep the orders for this company
			masterData.orders.filter(order => order[piCol] == pi)
			// For each order
			.forEach(order => {
				// Get data from order so it's easier to work with
				const cname = order[cnameCol];

				// If customer isn't registered yet, add it
				if (!salesOrdersByCustomer.hasOwnProperty(cname)){
					// Mark as tracked
					salesOrdersByCustomer[cname] = true;
				}

			});

			// How many companies
			const count = Object.keys(salesOrdersByCustomer).length;

			// Get answer
			const result = Math.ceil(count * pct / 100);

			return [result];
		}
	},
	/* Temporarily remove q13 and q14 *
	// Q13
	{
		template: "%CN is in what percentile for total sales amounts?",
		calculateAnswer: function(cn){

			// Get the columns for the data we need
			const cnameCol = getNumForColumn("Customer Name");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Variables to store our data
			const salesAmountsByCustomerMap = {};

			// Keep the orders for this company
			masterData.orders
			// For each order
			.forEach(order => {
				// Get data from order so it's easier to work with
				const cname = order[cnameCol];

				// If customer isn't registered yet, add it
				if (!salesAmountsByCustomerMap.hasOwnProperty(cname)){
					// Start at 0
					salesAmountsByCustomerMap[cname] = 0;
				}

				salesAmountsByCustomerMap[cname] += +order[salesAmountCol];

			});

			// Convert to a list of sales amount objects
			let listOfCustomersAndSalesAmounts =
			// From the customer names
			Object.keys(salesAmountsByCustomerMap)
			.map(customer => {
				// add the object to the list
				return {
					customer: customer,
					amount: salesAmountsByCustomerMap[customer]
				};
			})

			// sort the list in ascending order
			listOfCustomersAndSalesAmounts = listOfCustomersAndSalesAmounts.sort((a, b) => a.amount - b.amount);

			// Find the company in the list
			let i = 0;
			for (;i < listOfCustomersAndSalesAmounts.length; i++){
				if (listOfCustomersAndSalesAmounts[i].customer == cn){
					break;
				}
			}

			// Convert place to percentile with two decimals
			const result = Math.ceil(10000 * i / (listOfCustomersAndSalesAmounts.length - 1)) / 100;

			return [result];
		}
	},
	// Q14
	{
		template: "%CN is in what percentile for average sales amounts?",
		calculateAnswer: function(cn){

			// Get the columns for the data we need
			const cnameCol = getNumForColumn("Customer Name");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Variables to store our data
			const salesAmountsByCustomerMap = {};
			const salesCountsByCustomerMap = {};

			// Keep the orders for this company
			masterData.orders
			// For each order
			.forEach(order => {
				// Get data from order so it's easier to work with
				const cname = order[cnameCol];

				// If customer isn't registered yet, add it
				if (!salesAmountsByCustomerMap.hasOwnProperty(cname)){
					// Start at 0
					salesAmountsByCustomerMap[cname] = 0;
					salesCountsByCustomerMap[cname] = 0;
				}

				salesAmountsByCustomerMap[cname] += +order[salesAmountCol];
				salesCountsByCustomerMap[cname]++;

			});

			// Convert to a list of sales amount objects
			let listOfCustomersAndAverageSalesAmounts =
			// From the customer names
			Object.keys(salesAmountsByCustomerMap)
			.map(customer => {
				// add the object to the list
				return {
					customer: customer,
					amount: salesAmountsByCustomerMap[customer] / salesCountsByCustomerMap[customer]
				};
			})

			// sort the list in ascending order
			listOfCustomersAndAverageSalesAmounts = listOfCustomersAndAverageSalesAmounts.sort((a, b) => a.amount - b.amount);

			// Find the company in the list
			let i = 0;
			for (;i < listOfCustomersAndAverageSalesAmounts.length; i++){
				if (listOfCustomersAndAverageSalesAmounts[i].customer == cn){
					break;
				}
			}

			// Convert place to percentile with two decimals
			const result = Math.ceil(10000 * i / (listOfCustomersAndAverageSalesAmounts.length - 1)) / 100;

			return [result];
		}
	}
	/* */
];