# henkilotieto_app
Yksinkertainen sovellus, joka tarjoaa CRUD-toiminnot henkilötiedoille REST-apin kautta.
Toteutettu myös tietojen validointi niin, että nimiksi ei sallita tyhjiä merkkijonoja,
emailin täytyy olla oikean muotoinen ja sosiaaliturvatunnuksen sopia annettuun syntymäpäivään
sekä tarkistussumman sopia.

Palvelin kuuntelee porttia 3000.

API:a käytetään seuraavalla tavalla:

Kaikkien henkilötietojen hakeminen
GET url/personaldata
Palautetaan 200 ja kaikkien tietokannassa olevat henkilötietojen polut ja henkilötiedon
nimitiedot.

Henkilötiedon luominen
POST url/personaldata + kuormana json olio muotoa {firstName: 'etunimi', lastName: 'sukunimi', 
email: 'esimerkkisposti@osoite.com', socialSequrityNum: 'oikean muotoinen sosiaaliturvatunnus',
dateOfBirth: 'sosiaaliturvatunnukseen sopiva päivämäärä'}
Palautetaan 201 onnistuneen luonnin yhteydessä sekä luodunhenkilötiedon arvot ja
uuden henkilötiedon url. Palautetaan 400 ja opaste, jos pyynnön mukana tullut
henkilötieto ei mennyt läpi validoinnista.

Henkilötiedon poistaminen
DELETE url/personaldata/henkilötiedon avain
Palautetaan 204 onnistuneen poistamisen yhteydessä tai 404, jos henkilötietoa ei
löytynyt annetulla avaimella.

Yksittäisen henkilötiedon hakeminen
GET url/personaldata/henkilötiedon avain
Palautetaan 200 ja henkilötiedon kaikki tiedot tai 404, jos henkilötietoa ei
löytynyt annetulla avaimella.

Henkilötiedon muokkaaminen
PUT url/personaldata/henkilötiedon avain + kuormana json olio muotoa {firstName: 'etunimi', lastName: 'sukunimi', 
email: 'esimerkkisposti@osoite.com', socialSequrityNum: 'oikean muotoinen sosiaaliturvatunnus',
dateOfBirth: 'sosiaaliturvatunnukseen sopiva päivämäärä'}
Palautetaan 200 sekä muokatun henkilötiedon tiedot ja url tai 404, jos henkilötietoa
ei löytynyt annetulla avaimella. Palautetaan 400 ja opaste, jos pyynnön mukana tullut
henkilötieto ei mennyt läpi validoinnista.

Virhetilanteet:
Tietokantavirheen sattuessa käyttäjälle palautetaan tietokannan antama virheilmoitus.

