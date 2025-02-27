import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener("DOMContentLoaded", () => {

    console.log(JSON.parse(localStorage.getItem("tweet-data")))
    document.addEventListener('click', (e) => {
        if (e.target.dataset.like){
            handleLikeClick(e.target.dataset.like)
        }
        else if (e.target.dataset.retweet){
            handleRetweetClick(e.target.dataset.retweet)
        }
        else if (e.target.dataset.reply){
            handleReplyClick(e.target.dataset.reply)
        }
        else if (e.target.id === 'tweet-btn'){
            handleTweetBtnClick()
        }
    })

    function handleTweetBtnClick(){
        const tweetInput = document.getElementById('tweet-input')

        if(tweetInput.value){   
            const newTweetObj = {
                handle: `@ReedSans 💎`,
                profilePic: `/images/you-got-this.jpg`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4(),
            }
            tweetsData.unshift(newTweetObj)
        }
        tweetInput.value = ""
        localStorage.setItem("tweet-data", JSON.stringify(tweetsData))
        render()
    }

    function handleLikeClick(tweetId){
        const targetTweetObj = tweetsData.filter((tweet) => tweet.uuid === tweetId)[0]
        if (targetTweetObj.isLiked){
            targetTweetObj.likes--        
        }   else {
            targetTweetObj.likes++
        }
        targetTweetObj.isLiked = !targetTweetObj.isLiked
        render()
    }

    function handleRetweetClick(tweetId){
        const targetTweetObj = tweetsData.filter((tweet) => tweet.uuid === tweetId)[0]
        if (targetTweetObj.isRetweeted){
            targetTweetObj.retweets--        
        }   else {
            targetTweetObj.retweets++
        }
        targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
        render()
    }

    function handleReplyClick(replyId){
        const replyDiv = document.getElementById(`replies-${replyId}`)
        replyDiv.classList.toggle('hidden')
    }


    function getFeedHTML (){
        let feedHTML = ``
        tweetsData.forEach((tweet) => {
            let likeIconClass = ""        
            if(tweet.isLiked){
                likeIconClass = "liked" 
            }

            let retweetIconClass = ""
            if(tweet.isRetweeted){
                retweetIconClass = "retweeted"
            }

            let repliesHtml = ""
            if(tweet.replies.length > 0){
                tweet.replies.forEach((reply) => 
                    repliesHtml += `
                        <div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic"/>
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <p class="tweet-text">${reply.tweetText}</p>
                                    </div>
                            </div>
                        </div>
                    `
                )
            }

            feedHTML += `
                <div class="tweet">
                    <div class="tweet-inner">
                        <img src=${tweet.profilePic} class="profile-pic">
                        <div>
                            <p class="handle">${tweet.handle}</p>
                            <p class="tweet-text">${tweet.tweetText}</p>
                            <div class="tweet-details">
                                <span class="tweet-detail">
                                    <i class="fa-regular fa-comment-dots" data-reply=${tweet.uuid}></i>
                                    ${tweet.replies.length}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-heart ${likeIconClass}" data-like=${tweet.uuid}></i>
                                    ${tweet.likes}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet=${tweet.uuid}></i>
                                    ${tweet.retweets}
                                </span>
                                
                            </div>
                        </div>
                    </div>
                    <div id="replies-${tweet.uuid}" class="hidden">
                        ${repliesHtml}
                    </div> 
                </div>
            `
        })    
        return feedHTML
    }

    function render(){
        document.getElementById('feed').innerHTML = getFeedHTML()
    }

    render()
})

