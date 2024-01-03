

## Getting Started

First, install all the node modules and dependencies 

 run the development server:
 
 ```bash
npm i
# or
npm install

```
Then, 
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

**The Assumptions I made while doing the task **
- No decimal balance value
- Changing currency will reset denominator count
- Removing a denominator will remove it from the total balance as well
- While adding a denominator it won't add any duplicate denominator if the denominator already exists. Also it will sort the denominators in order.

**How to use**
- User can increase denominator count by pressing on **Add** button.
- User can decrease denominator count by pressing on **Remove** button. It will show invald request alert if user clicks on remove button when the note count is 0. When user clicks on Remove button it will show an alert "Are you sure you want to delete the denominator?" Pressing on yes will remove the denomiantor from the list. 
- User can add denominator in the selected currencies. The added denominator will sort in order. For example, if I have denominator of 1,2,20,100 and I add a denominator 50, it will place after 20 and before 100. If user add denominator when currency is selected in **EURO** then the denominator will only be added in **EURO** currency. It won't be added for **DOLLAR** and **BDT**. 
- User can't add a duplicate denominator. 
- User can remove a denominator by pressing on **X** button beside the denominator value. It will remove that denominator from the list and remove it from total balance. For example, if my balance is 1000 and I have a denominator 100 and it's count is 1. If I remove that denominator my total balance will be 900.
- User can change currency from the selector. It will show the total balance according to the chosen currencies. For example, If the total balance is $100, after choosing **EUR** it will be converted to EURO and the total balance will be **EUR** 91. If BDT is chosen then the balance will be converted to **TAKA** and it will be 10,952 **Taka**.
- The wallet data is loaded from the local storage. If we refresh the page the data will be persistant.
  <img width="1440" alt="image" src="https://github.com/Sabah97/wallet-management/assets/28053610/42da63b9-1fdc-421d-a3c6-7228f795494b">

  

