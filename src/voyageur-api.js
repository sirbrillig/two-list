/* @format */
import request from 'superagent';
import { VOYAGEUR_API_SERVER } from './private-vars';

const baseUrl = `${VOYAGEUR_API_SERVER}`;

export function listLocations(token) {
  if (!token) {
    throw new Error('Token is required');
  }
  return new Promise((resolve, reject) => {
    const listLocationsUrl = `${baseUrl}/secured/locations`;
    request
      .get(listLocationsUrl)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return reject(err);
        const data = res.body;
        if (!data) return reject('No data found in response');
        return resolve(data);
      });
  });
}

export function createNewLocation(token, params) {
  if (!token) {
    throw new Error('Token is required');
  }
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/secured/locations`;
    request
      .post(url)
      .send(params)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return reject(err);
        const data = res.body;
        if (!data) return reject('No data found in response');
        return resolve(data);
      });
  });
}

export function deleteLocationFromLibrary(token, location) {
  if (!token) {
    throw new Error('Token is required');
  }
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/secured/locations/${location.id}`;
    request
      .delete(url)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return reject(err);
        const data = res.body;
        if (!data) return reject('No data found in response');
        return resolve(data);
      });
  });
}

export function updateLocationParams(token, location, params) {
  if (!token) {
    throw new Error('Token is required');
  }
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/secured/locations/${location.id}`;
    request
      .put(url)
      .send(params)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return reject(err);
        const data = res.body;
        if (!data) return reject('No data found in response');
        return resolve(data);
      });
  });
}

export function reorderLibrary(token, ids) {
  if (!token) {
    throw new Error('Token is required');
  }
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/secured/locations`;
    request
      .put(url)
      .send({ locations: ids })
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return reject(err);
        const data = res.body;
        if (!data) return reject('No data found in response');
        return resolve(data);
      });
  });
}

export function getDistanceBetween(token, start, dest) {
  if (!token) {
    throw new Error('Token is required');
  }
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/secured/distances`;
    request
      .post(url)
      .send({ start, dest })
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return reject(err);
        const data = res.body;
        if (typeof data === 'undefined' || data === null)
          return reject('No data found in response');
        return resolve(data);
      });
  });
}
