/**
* @author       Samuel Rodrigues <liquesbr@hotmail.com>
* @copyright    MIT
* @license      {@link https://github.com/Liques/PhaserCalangoHelper/blob/master/LICENSE|MIT License}
*
* @overview
*
* Phaser Calango - https://github.com/Liques/PhaserCalango
*
* v1.0.1 "2017-09-25" 
*
* By Samuel Rodrigues  @liques
*
* This library is just a small helper to make Phaser games interface easier without
* any other tools, just using code.
*
*/


function ToGeneralScale(obj) {
    obj.scale = { x: obj.scale.x + generalScaleChange, y: obj.scale.y + generalScaleChange }
}


function ScenarioSprite(scenario, scenarioGroup) {

    this.Sprite = null;
    this.X = 0;
    this.Y = 0;
    this.DifferenceX = 0;
    this.DifferenceY = 0;
    this.DifferenceZ = 0;
    this.ScaleX = 0;
    this.ScaleY = 0;
    this.DifferenceScaleX = 0;
    this.DifferenceScaleY = 0;
    this.Rotation = 0;
    this.DifferenceRotation = 0;
    this.Opacity = 1;
    this.DifferenceOpacity = 0;

    this.HorizontalInvert = 1;
    this.VerticalInvert = 1;

    this.DebugMode = false;
    var clickedRightButton = true;
    var firstTime = true;

    this.ParentScenarioSprite = null;

    if (scenarioGroup) {
        if (scenarioGroup.Enabled) {
            this.Group = scenarioGroup;
        }
    }

    this.Visible = true;

    this.update = function () {

        if (firstTime && this.Group && this.Sprite) {
            scenarioGroup.Group.add(this.Sprite);
            scenarioGroup.ObjectList.push(this);
            firstTime = false;
        }

        if (this.Sprite) {
            this.Sprite.x = (scenario.DockX + this.X + this.DifferenceX);
            this.Sprite.y = (scenario.DockY + this.Y + this.DifferenceY);
            this.Sprite.scale = { x: (this.ScaleX + this.DifferenceScaleX + scenario.ScaleX) * this.HorizontalInvert, y: (this.ScaleY + this.DifferenceScaleY + scenario.ScaleY) * this.VerticalInvert };
            this.Sprite.rotation = this.Rotation + this.DifferenceRotation;
            this.Sprite.alpha = this.Opacity + this.DifferenceOpacity

            this.Sprite.visible = this.Visible;
        }

        if (this.customUpdate) {
            this.customUpdate();
        }

        if (this.DebugMode && generalDebugMode) {

            if (game.input.activePointer.leftButton.isDown) {


                game.debug.text('X: ' + this.X + ' , Y: ' + this.Y, 100, 100);


                if (this.Group) {
                    game.debug.text('grouped' + this.X + ' , Y: ' + this.Y, 100, 200);

                    this.X = game.input.x - this.Group.X;
                    this.Y = game.input.y - this.Group.Y;

                } else {
                    this.X = game.input.x;
                    this.Y = game.input.y;
                }

            }

            if (game.input.activePointer.middleButton.isDown) {

                this.Rotation += 0.1;
            } else {
                this.Rotation = 0;
            }

            if (game.input.mouse.wheelDelta > 0) {

                
                
                this.ScaleX += 0.01;
                this.ScaleY += 0.01;

                game.debug.text('ScaleX: ' + this.ScaleX + ' , ScaleY: ' + this.ScaleY, 100, 100);

            } else if (game.input.mouse.wheelDelta < 0) {

                this.ScaleX -= 0.01;
                this.ScaleY -= 0.01;

                game.debug.text('ScaleX: ' + this.ScaleX + ' , ScaleY: ' + this.ScaleY, 100, 100);
            }

            game.input.mouse.wheelDelta = 0;

            

            if (game.input.activePointer.rightButton.isDown) {

                var xPointer = game.input.x - (this.X + scenario.DockX) + (this.Sprite.width * this.Sprite.anchor.x);
                var x = xPointer / this.Sprite.width;
                var yPointer = game.input.y - (this.Y + scenario.DockY) + (this.Sprite.height * this.Sprite.anchor.y);
                var y = yPointer / this.Sprite.height;

                if (clickedRightButton == false) {
                    game.debug.text('X axis: ' + x + ' , Y axis: ' + y, 100, 100);
                    this.Sprite.anchor.setTo(x, y);
                    clickedRightButton = true;
                }


            } else {
                clickedRightButton = false;
            }
        }

    };

    this.updateAndCopyFrom = function (objToGetCopied) {



        this.X = objToGetCopied.X;
        this.Y = objToGetCopied.Y;
        this.DifferenceX = objToGetCopied.DifferenceX;
        this.DifferenceY = objToGetCopied.DifferenceY;
        this.ScaleX = objToGetCopied.ScaleX;
        this.ScaleY = objToGetCopied.ScaleY;
        this.DifferenceScaleX = objToGetCopied.DifferenceScaleX;
        this.DifferenceScaleX = objToGetCopied.DifferenceScaleX;
        this.Rotation = objToGetCopied.Rotation;

        this.Opacity = objToGetCopied.Opacity;

        this.Sprite.anchor = objToGetCopied.Sprite.anchor;

        this.update();

    };
}

function TypeTextEffect(textObj, delay, onComplete) {

    if (isNaN(delay)) {
        delay = 0;
    }

    var textoTotal = textObj.text;

    var tempo = 0;

    var caracteresNormais = 0;
    var caracteresRapidos = 0;

    for (var i = 0; i < textoTotal.length; i++) {
        if (textoTotal[i] != '' && textoTotal[i] != '_') {
            caracteresNormais++;
        } else {
            caracteresRapidos++
        }
    }

    window.setTimeout(function (textObj, textoTotal) {

        textObj.text = '';

        var step = 0;

        for (var i = 0; i < textoTotal.length; i++) {


            window.setTimeout(function (textObj, texto, i) {
                textObj.text += texto[i];
            }, step * 100, textObj, textoTotal, i);

            if (textoTotal[i] != '' && textoTotal[i] != '_') {
                step++;
            } else {
                step += .1;
            }

            if (i + 1 == textoTotal.length) {
                if (onComplete) {
                    onComplete();
                }
            }

        }

    }, delay, textObj, textoTotal);

    return (caracteresNormais * 100) + (caracteresRapidos * .1);

}



function ScenaryDefault() {
    this.DockX = 0;
    this.DockY = 0;
    this.ScaleX = 0.5;
    this.ScaleY = 0.5;
}

function ScenaryLoad(nomeFase) {
    game.load.image('blank', '../assets/blank.png');
    var blank = game.add.sprite(0, 0, 'blank');
    blank.scale = { x: 200, y: 200 }

    blank.alpha = 0;
    var logoAnimBlank = game.add.tween(blank).to({ alpha: 1 }, 500, Phaser.Easing.Linear.In, true);

    logoAnimBlank.onComplete.add(function () {
        game.stage.backgroundColor = '#FFFFFF';
        game.state.start(nomeFase);
    }, true);
}

function ScenarySplash() {
    game.load.image('blank', '../assets/blank.png');
    var blank = game.add.sprite(0, 0, 'blank');
    blank.scale = { x: 200, y: 200 }

    blank.alpha = 100;
    var logoAnimBlank = game.add.tween(blank).to({ alpha: 0 }, 500, Phaser.Easing.Linear.In, true);

    logoAnimBlank.onComplete.add(function () {
        logoAnimBlank = null;
    }, true);
}


function ScenarioGroup() {

    this.Group = game.add.group();
    this.X = 0;
    this.Y = 0;
    this.DifferenceX = 0;
    this.DifferenceY = 0;
    this.DifferenceZ = 0;
    this.ScaleX = 1;
    this.ScaleY = 1;
    this.DifferenceScaleX = 0;
    this.DifferenceScaleY = 0;
    this.Rotation = 0;
    this.Opacity = 1;
    this.DifferenceOpacity = 0;

    this.ObjectList = new Array();

    this.Enabled = true;

    this.HorizontalInvert = 1;
    this.VerticalInvert = 1;

    this.DebugMode = false;
    var clickedRightButton = true;

    this.update = function () {

        this.Group.x = (this.X + this.DifferenceX);
        this.Group.y = (this.Y + this.DifferenceY);
        this.Group.scale = { x: (this.ScaleX + this.DifferenceScaleX) * this.HorizontalInvert, y: (this.ScaleY + this.DifferenceScaleY) * this.VerticalInvert };
        this.Group.rotation = this.Rotation;
        this.Group.alpha = this.Opacity + this.DifferenceOpacity;

        if (this.DebugMode && generalDebugMode) {

            if (game.input.activePointer.leftButton.isDown) {
                this.X = game.input.x;
                this.Y = game.input.y;

                game.debug.text('X: ' + this.X + ' , Y: ' + this.Y, 100, 100);
            }

            if (game.input.activePointer.middleButton.isDown) {

                this.Rotation += 0.1;
            } else {
                this.Rotation = 0;
            }


            if (game.input.activePointer.rightButton.isDown) {

                var xPointer = game.input.x - (this.X) + (this.Group.width * this.Group.pivot.x);
                var x = xPointer;
                var yPointer = game.input.y - (this.Y) + (this.Group.height * this.Group.pivot.y);
                var y = yPointer;

                if (clickedRightButton == false) {
                    game.debug.text('X axis: ' + x + ' , Y axis: ' + y, 100, 100);
                    this.Group.pivot.setTo(x, y);
                    clickedRightButton = true;
                }


            } else {
                clickedRightButton = false;
            }


            if (game.input.mouse.wheelDelta > 0) {



                this.ScaleX += 0.01;
                this.ScaleY += 0.01;

                game.debug.text('ScaleX: ' + this.ScaleX + ' , ScaleY: ' + this.ScaleY, 100, 100);

            } else if (game.input.mouse.wheelDelta < 0) {

                this.ScaleX -= 0.01;
                this.ScaleY -= 0.01;

                game.debug.text('ScaleX: ' + this.ScaleX + ' , ScaleY: ' + this.ScaleY, 100, 100);
            }

            game.input.mouse.wheelDelta = 0;
        }

        if (this.customUpdate) {
            this.customUpdate();
        }

    };

}

function SetEye(obj, time) {


    if (isNaN(time)) {
        time = 2000;
    }
    obj.Visible = false;
    window.setInterval(EyeControl, time, obj);
}



function EyeControl(sprite) {

    sprite.Visible = true;
    window.setTimeout(function () {


        sprite.Visible = false;
    }, 150);
}
