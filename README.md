
# STOCK PORTFOLIO

using this site users can choose stock view stock details and add this to their portfolio with the quantity of their stock . any time they can get live prices.  

#### Frontend Live link-> https://stockexchange123.netlify.app/
#### Backend Live link->https://stockexchange12.herokuapp.com/

#### Frontend code link-> https://github.com/bhaumikankan/Stock-frontened.git
#### Backend code link-> https://github.com/bhaumikankan/Stock-Backend.git

#### assigned on -> 28/07/2022  Submitted on ->29/07/2022 
# Development flow and API Reference

## 1.Upload the excel sheet 
### converted the excel data to json the save it in mongodb with files ->1.stockname 2.stockcode 3.stock VAR
### API no.1->
```http
   /stock/uploadXL
```
## 2.Get all stocks from Uploaded excel data
### API no.2->
```http
   /stock/getAll
```
## 3.Get stock details based on their stockname as per excelsheet
### ->got stockname as a quary and from mongodb got the stockcode 
### ->using this stockcode call a extrenal api and got a html list item. using webscrapping extracted the BOM code 
```http
   https://api.bseindia.com/Msource/90D/getQouteSearch.aspx?Type=EQ&text={stockcode}&flag=gq

```   
### ->using the BOM code  get stock details
```http
https://api.bseindia.com/BseIndiaAPI/api/StockReachGraph/w?scripcode={BOM code}&flag=0&fromdate=&todate=&seriesid=

``` 
### API no.3->  
```http
   /stock/getStock?sname=stockname
```
## 4.After getting stock details user can add this stock to their profile ({stockname,quantity,VAR,bom} using these as a req body) 
### API no.4-> 
```http
   /adduserStock/:id of user
```
## 4.User can get their portfolio stocks 
### API no.5-> 
```http
   /getuserStock/:id of user
```



## Login api
```http
   /auth/login
```

## Register api
```http
   /auth/register
```














