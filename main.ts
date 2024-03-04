
function generateImage () {
    basic.clearScreen()
    for (let i = 0; i <= background.length - 1; i++) {
        let coor = toCoordinate(background[i])
        led.plot(coor[0], coor[1])
    }
    for (let i=0;i<current.length;i++){
        let coor = toCoordinate(current[i])
        led.plot(coor[0],coor[1])
    }
}
let bricks: number[][] = [[-9, -8, -4, -3],[-9,-4,-3],[-8,-4,-3],[-8,-3],[-4,-3],[-3]]
let current = randomBrick()
let background: number[] = []
let wait = 0
wait = 500
basic.forever(function(){
    moveBrickDown()
    basic.showString("Game Over!")

})
input.onButtonPressed(Button.B,function(){
    let possibleBrick = current.map(function (n) {
        return n + 1
    })
    if (!reachRightEdge() && !containsAny(background, possibleBrick)) {
        current = possibleBrick
        generateImage()
    }
})
input.onButtonPressed(Button.AB,function(){
    rotateBrick()
})
input.onButtonPressed(Button.A, function () {
    let possibleBrick = current.map(function(n){
        return n-1
    })
    if (!reachLeftEdge()&&!containsAny(background,possibleBrick)){
        current = possibleBrick
        generateImage()
    }
})

function moveBrickDown(){
    while(true){
        let possibleBrick = current.map(function (n) {
            return n + 5
        })
        if (containsAny(background, possibleBrick) || reachBottom()) {
            background = background.concat(current)
            removeLine()
            if(background.some(function(n){
                return n<0
            })){
                break
            }
            current = randomBrick()
        } else {
            current = possibleBrick
        }
        generateImage()
        basic.pause(wait)
    }
    
}

function toCoordinate(pos:number){
    let ledX = pos%5
    let ledY = Math.trunc(pos/5)
    return [ledX,ledY]
}

function contains(array:number[],n:number){
    for(let i=0;i<array.length;i++){
        if(array[i]==n)return true
    }
    return false
}
function containsAny(array:number[],nums:number[]){
    if(array.length==0){
        return false
    }
    return nums.some(function(n){
        return contains(array,n)
    })
}
function containsAll(array: number[], nums: number[]) {
    if (array.length == 0) {
        return false
    }
    return nums.every(function (n) {
        return contains(array, n)
    })
}
function reachBottom(){
    return current.some(function(n){
        return n+5>=25
    })
}
function reachLeftEdge(){
    return current.some(function(n){
        return n%5==0
    })
}
function reachRightEdge(){
    return current.some(function(n){
        return (n+1)%5==0
    })
}
function randomBrick(){
    return bricks[randint(0, bricks.length-1)]
}
function removeLine(){
    let lines = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24]]
    for(let i=0;i<lines.length;i++){
        if(containsAll(background,lines[i])){
            background = background.filter(function(n){
                return !contains(lines[i],n)
            })
            for(let j=0;j<background.length;j++){
                if(background[j]<lines[i][0]){
                    background[j]+=5
                }
            }
            
        }
    }
}
function rotateBrick(){
    let type =brickType()
    let possibleBrick = current
    switch (type){
        case 3:
        possibleBrick[0]-=4
        break
        case 4:
        possibleBrick[0]+=4
        break
        case 5:
        possibleBrick[0]+=1
        break
        case 6:
        possibleBrick[0]-=1
        possibleBrick[1]-=4
        break
        case 7:
        possibleBrick[1]+=4
        possibleBrick[2]+=1
        break
        case 8:
        possibleBrick[2]-=1
        default:
        break
    }
    if(!containsAny(background,possibleBrick)){
        current=possibleBrick
        generateImage()
    }

}
function brickType(){
    if (current.length==4){
        return 1
    }else if(current.length==1){
        return 2
    }else if(current.length==2){
        if (current[0]+1==current[1]){
            return 3
        }else{
            return 4
        }
    }else{
        if(current[0]+5==current[1]){//1,6,7
            return 5
        }else if(current[0]+5==current[2]&&current[1]+1==current[2]){//2,6,7
            return 6
        }else if(current[0]+5==current[2]){//1,2,6
            return 7
        }else{//1,2,7
            return 8
        }
    }
}