#!/usr/bin/env bash

./gdown.pl https://drive.google.com/open\?id\=1j5MeVfxg6YDAgfzmcoNf6JxKSYJQMnpH ../../../../data/raw/criminal_incidence.zip

yes A | unzip ../../../../data/raw/criminal_incidence.zip '*/*.csv' -x '*/*/*'

mv Municipal-Delitos-2015-2019_ago19/'Municipal Delitos - agosto 2019.csv' ../../../../data/raw/crime_municipality.csv

var="Year, ent_key, entity, muni, mun, legal_good, crime, crime_subtype, performed, January, February, March, April, May, June, July, August, September, October, November, December"

awk -i inplace '$0 = NR==1 ? replace : $0' replace="$var" ../../../../data/raw/crime_municipality.csv

head ../../../../data/raw/crime_municipality.csv
