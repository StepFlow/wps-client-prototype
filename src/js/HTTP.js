import axios from 'axios';

const HTTP = axios.create({
  baseURL: 'http://skydome.satellite.dvo.ru:8080/geoserver/ows',
  params: {
    service: 'wps',
    version: '1.0.0',
  },
});

export default HTTP;
