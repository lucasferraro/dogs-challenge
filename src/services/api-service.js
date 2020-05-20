import {httpGet} from "./api-client";

export async function getBreeds() {
  const response = await httpGet("/breeds/list/all");
  return response.data ? response.data : [];
}

export async function getBreed(breed, subBreed) {
  const url = subBreed ? `breed/${breed}/${subBreed}/images` : `breed/${breed}/images`
  const response = await httpGet(url);
  return response.data ? response.data : [];
}
