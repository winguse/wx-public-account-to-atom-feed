import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

async function $crawl(url: string) {
	const response = await fetch(url)
	const text = await response.text()
	return cheerio.load(text)
}

async function crawl(publicId: string) {
	const $search = await $crawl(`http://weixin.sogou.com/weixin?type=1&query=${publicId}`)
	const url = $search('.results > div').attr('href')
	console.log(url)
}

crawl('programmer_life')