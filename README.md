# henkilotieto_app
Yksinkertainen sovellus, joka tarjoaa CRUD-toiminnot henkilötiedoille REST-apin kautta.
Toteutettu myös tietojen validointi niin, että nimiksi ei sallita tyhjiä merkkijonoja,
emailin täytyy olla oikean muotoinen ja sosiaaliturvatunnuksen sopia annettuun syntymäpäivään
sekä tarkistussumman sopia.

API:a käytetään seuraavalla tavalla:

Kaikkien henkilötietojen hakeminen
GET url/personaldata

Henkilötiedon luominen
POST url/personaldata + kuormana json olio muotoa {firstName: 'etunimi', lastName: 'sukunimi', 
email: 'esimerkkisposti@osoite.com', socialSequrityNum: 'oikean muotoinen sosiaaliturvatunnus',
dateOfBirth: 'sosiaaliturvatunnukseen sopiva päivämäärä'}

Henkilötiedon poistaminen
DELETE url/personaldata/henkilötiedon avain

Yksittäisen henkilötiedon hakeminen
GET url/personaldata/henkilötiedon avain

Henkilötiedon muokkaaminen
PUT url/personaldata/henkilötiedon avain + kuormana json olio muotoa {firstName: 'etunimi', lastName: 'sukunimi', 
email: 'esimerkkisposti@osoite.com', socialSequrityNum: 'oikean muotoinen sosiaaliturvatunnus',
dateOfBirth: 'sosiaaliturvatunnukseen sopiva päivämäärä'}


