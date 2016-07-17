import fetch from 'node-fetch';

async function fetchWebTest(url:string) {
	const response = await fetch(url);
	const text = await response.text();
	console.log(text);
}

fetchWebTest('https://winguse.com');