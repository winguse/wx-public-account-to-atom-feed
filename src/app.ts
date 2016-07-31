import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { AllHtmlEntities } from 'html-entities'

const entities = new AllHtmlEntities()

const wxFetchOptions = {
	compress: false
}


async function $crawl(url: string) {
	const response = await fetch(url, wxFetchOptions)
	const text = await response.text()
	return cheerio.load(text, {decodeEntities: false})
}

async function $crawlArticle(url: string) {
	
}

async function crawl(publicId: string) {
	const $search = await $crawl(`http://weixin.sogou.com/weixin?type=1&query=${publicId}`)
	const url = entities.decode($search('.results > div').attr('href'))
	const response = await fetch(url, wxFetchOptions)
	const text = await response.text()
	const regex = /var msgList = '(.+?)';/
	const matches = text.match(regex)
	if (matches) {
		const data = JSON.parse(entities.decode(entities.decode(matches[1])))
		const articles = data.list.map(({app_msg_ext_info}) => {
			const {author, content_url, title} = app_msg_ext_info
			return {author, url: `https://mp.weixin.qq.com${content_url.replace(/\\\//g, '/')}`, title}
		})
		console.log(articles)
		for (let i = 0; i < articles.length; i++) {
			const {url} = articles[i]
			const $detailPage = await $crawl(url)

			$detailPage('#js_content img').each((index, element) => {
				const $element = $detailPage(element)
				const style = $element.attr('style')
				$element.replaceWith(`<img src='${$element.attr('data-src')}'${style ? ` style='${style}'` : ''}/>`)
			})

			const $content = $detailPage('#js_content')
			console.log($content.html())
			break
		}
	} else {
		console.log('not matched')
	}
}

async function main () {
	try {
		await crawl('programmer_life')
	} catch (e) {
		console.error(e)
	}
}

main()