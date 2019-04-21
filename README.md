# Open Food Facts (Nova)

![](public/img/nutriscore-a.svg)
![](public/img/nova-group-1.svg)

This project is a simple listing of products from the Open Food Facts data source under the NOVA 1 and Nutrition Score A grade

### Sample data

Download the CSV from [here](https://world.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=nova_groups&tag_contains_0=contains&tag_0=1&tagtype_1=nutrition_grades&tag_contains_1=contains&tag_1=A&tagtype_2=categories&tag_contains_2=does_not_contain&tag_2=eaux&sort_by=unique_scans_n&page_size=20&axis_x=energy&axis_y=products_n&action=display) and import the sample data into MongoDB:

```bash
mongoimport --db openfood --collection products --type tsv --file openfoodfacts_search.csv --headerline
```

### Development

```bash
npm install
npm run start:dev
```
