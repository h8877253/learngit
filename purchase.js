var Purchase = {};
Purchase.contextPath = contextPath;
Purchase.fundCode = "";
Purchase.currencyAssets = "";
Purchase.currencyPurchaseFee = "";
Purchase.purchaseFundBuyInfo = "";
Purchase.transactionsCode = "";
Purchase.fundfee="";
Purchase.transactionsAccount="000560";
Purchase.discount=10;
Purchase.money;
Purchase.age=0;
Purchase.currStep=0;
Purchase.fundName="";
Purchase.money_zh="";
Purchase.useCurrency="1";
Purchase.pwd="";
Purchase.transactionsName="现金宝账户";
Purchase.fundListLoading=true;
Purchase.fundTypeLoading=true;
Purchase.fundList=[];
Purchase.currencyFundCode="";
Purchase.sendMsg=false;
Purchase.sendTradeMsg=false;
Purchase.sendTradeMsgBuyLimit=0.0
Purchase.curCardMobile="";
Purchase.timeout=60;
Purchase.professionflag="";
Purchase.custRisk="";
Purchase.Interval1;
Purchase.bankCards;
Purchase.bankCode;
Purchase.flag=true;
//用于记录购买基金的编号
Purchase.no;
//用于记录提升额度的编号
Purchase.no1;
//用于记录汇款支付的编号
Purchase.no2;
Purchase.promoteChannelMap;
Purchase.payType=2;
Purchase.slide="up";
Purchase.slide1="up";
//add by wangpingfei 20180409 当前用于购买基金的channelId
Purchase.currentPerchaseChannelId="";
Purchase.suspendChannelIdList="";
Purchase.promoteLimiteMap="";

Purchase.initPage = function(fundCode,transactionsCode,fundName,fundType,applysumInit,currencyFundCode,sendTradeMsg,sendTradeMsgBuyLimit) {

    if(TopdeepCommon.directSignChannelIdList==""){
        TopdeepCommon.ajaxQueryDrectChannelId();
    }
    Purchase.professionflag=$("#professionflagValue").val();
    Purchase.custRisk=$("#custRiskValue").val();
    Purchase.age = $("#age").val();

    Purchase.custRiskDesc=$("#riskLevelDesc").val();
    Purchase.fundRisk=$("#fundRiskValue").val();
    if(Purchase.fundRisk*1==1){
        $(".fundRisk").html("（低）");
    }else if(Purchase.fundRisk*1==2){
        $(".fundRisk").html("（中低）");
    }else if(Purchase.fundRisk*1==3){
        $(".fundRisk").html("（中）");
    }else if(Purchase.fundRisk*1==4){
        $(".fundRisk").html("（中高）");
    }else{
        $(".fundRisk").html("（高）");
    }
    if(fundCode=='163209'){
        $("#tips").show();
    }else{
        $("#tips").hide();
    }
    $(".custRisk").html("（"+Purchase.custRiskDesc+"）");

    /*点击下拉框中的提额按钮*/
    $("#step1").on("click",".promoteLimit",function(){
        //弹出弹框
        Purchase.no1 = $(this).attr("no");
        var currentCard = Purchase.bankCards[Purchase.no1];
        $("#tipMessage").html('您的'+currentCard.transactionsName+'卡可提升支付限额啦！点击立即提额按钮，按照页面提示按操作即可轻松提额。');
        $("#limiteMessage").html('支付限额可提升至'+Purchase.getPromoteLimite(currentCard.channelId)+'。大额支付更便捷！');
        $("#promoteDialog").parent().show();
        $("#promoteDialog").show();
    });

    /*点击弹框中的提额按钮，进入到输入信息界面*/
    $("#toPromote").click(function(){
        $("#promoteDialog").hide();
        var currentCard = Purchase.bankCards[Purchase.no1];
        $("#bankChannel").html('<i  class="bank-b'+currentCard.bankNo+'"></i>'+currentCard.bankName);
        $("#bankCardNo").html(currentCard.bankAccount.substr(0,4)+"********"+currentCard.bankAccount.substr(-4));

        var form = document.createElement("form");
        form.action = Purchase.contextPath  + "/t/promoteLimit.action";
        form.method = "post";
        form.style.display = "none";
        var text = document.createElement("textarea");
        text.name = "bankNo";
        text.value = currentCard.bankNo;
        form.appendChild(text);
        var text1 = document.createElement("textarea");
        text1.name = "bankName";
        text1.value = currentCard.transactionsName;
        form.appendChild(text1);
        var text2 = document.createElement("textarea");
        text2.name = "bankAccount";
        text2.value = currentCard.bankAccount;
        form.appendChild(text2);
        var text3 = document.createElement("textarea");
        text3.name = "goBackPage";
        text3.value = "3";
        form.appendChild(text3);
        var text4 = document.createElement("textarea");
        text4.name = "paySeatNo";
        text4.value = currentCard.paySeatNo;
        form.appendChild(text4);
        var text5 = document.createElement("textarea");
        text5.name = "channelId";
        text5.value = Purchase.getNewChannelId(currentCard.channelId);
        form.appendChild(text5);
        document.body.appendChild(form);
        var text6 = document.createElement("textarea");
        text6.name = "fundCode";
        text6.value = Purchase.fundCode;
        form.appendChild(text6);
        var text6 = document.createElement("textarea");
        text6.name = "oldChannelId";
        text6.value = currentCard.channelId;
        form.appendChild(text6);
        document.body.appendChild(form);

        form.submit();
    });


    $(document).on("click",".sub-select",function(){
        $(this).find(".select-list").slideToggle(100);
    })

    $(document).on("click",".select-list li",function(){
        $(this).parent().prev().val($(this).attr("value"));
        var selectValue=$(this).find("a").html();
        $(this).parent().parent().find('em').html(selectValue);
    })

    Purchase.showStep(1);
    Purchase.currencyFundCode = currencyFundCode;
    if(fundType!=null&&fundType!=""){
        Purchase.fundType = fundType;
    }
    Purchase.sendTradeMsg=sendTradeMsg;
    Purchase.sendTradeMsgBuyLimit = sendTradeMsgBuyLimit*1
    Purchase.fundName=fundName;
    $("#select").click(function(e){
        $("#searchKeyword").val("");
        Purchase.ajaxQueryFundType();
        $("#dialog").fadeIn(500);
    });
    $(".dialog-close").click(function(e){
        $("#dialog").fadeOut(500);
    });

    $(".verifyCodePic").click(function(){
        $(".verifyCodePic").attr("src",Purchase.contextPath+"/v/VerifyCodeServlet.action?v="+new Date().getTime());
    })

    $("[name='moneyFrom']:checked").each(function(){
        //获取折扣信息
        var discountHtml = $(this).attr("discountInfo");
        var radio=document.getElementsByName("moneyFrom");
        var checkvalue;
        for(var i=0;i<radio.length;i++){
            if(radio[i].checked){
                checkvalue = radio[i].value;

            }
        }
        if(checkvalue=="choseRmemitPay") {
                discountHtml="0折";
               Purchase.discount = "0折";
            $("#remit").show();
            }

        $("#remit").hide();
    })
    $("#goHistory7").click(function(){
        if(fundCode!=""){
            history.go(-1);
        }else{
            history.go(0);
        }
    });
    $("#goHistory").click(function(){
        if(fundCode!=""){
            history.go(-1);
        }else{
            history.go(0);
        }
    });
    if(applysumInit != null && applysumInit != ''){
        $(".purchaseMoney").val(applysumInit);
    }
    Purchase.money = $(".purchaseMoney").val();
    Purchase.money_zh = numToCNY.ConvertMoneyToChinese(Purchase.money);
    if(Purchase.money_zh!=""){
        $("#formalWriting").html(Purchase.money_zh);
    }else{
        $("#formalWriting").html("零元");
    }

    // 金额大写
    $(".purchaseMoney").bind('input propertychange', function() {
        $this = $(this);
        Purchase.money = $this.val();
        Purchase.money_zh = numToCNY.ConvertMoneyToChinese(Purchase.money);
        if(Purchase.money_zh!=""){
            $("#formalWriting").html(Purchase.money_zh);
        }else{
            $("#formalWriting").html("零元");
        }
        if(Purchase.fundCode!=""){
            Purchase.showCommissionCharge();
        }
    });


    $("#closeChildInput").click(function(){
        $("#alertChildInput").hide();
    })

    $("#confirmChildInput").click(function(){
        Purchase.ajaxPurchase();
    })
    $(".riskTest_olderThan60").click(function(){
        var fundcode=Purchase.fundCode;
        var custrisk=Purchase.custRisk;
        var fundrisk=Purchase.fundRisk;
        var age=Purchase.age;
        var action="0";
        if(Purchase.flag){
            Purchase.flag=false;

            document.getElementById("cancel_order").style.background="gray";
            $("#riskWarning_olderThan60").hide();
            Purchase.CancelClick(fundcode,custrisk,fundrisk,age,action);
        }
    })

    $(".riskTest").click(function(){
        /*window.location.href = Purchase.contextPath+"/t/riskEvaluation.action?step=2";*/
        $("#riskWarning").hide();
    })
    $("#riskTestUrl").click(function(){
        window.location.href = Purchase.contextPath+"/t/riskEvaluation.action";

    })
    $("#closeFillCustInfo").click(function(){
        $("#toRiskTest").hide();
    })

    $("#closeFillValiDate").click(function(){
        $("#fillValiDate").hide();
    })


    $("#riskProtocolAgreement").click(function() {
        Purchase.showStep(8);
        var container = $('#step8');
        $(container).scrollTop(
            0
        );
    })

    $("#goToConfirm").click(function(){
	if(Purchase.fundCode == '006025' && Number(Purchase.money) > 1000){
		var tipmsg = '诺安优化配置混合基金单日累计申购不超过1000元'
		TopdeepCommon.showDialog("warning",tipmsg,"确定");
	     return
	}
        //添加暂停网点的判断
        if(Purchase.ifSuspendChannel(Purchase.currentPerchaseChannelId)){
            TopdeepCommon.showDialog("fail","该银行已经暂停基金支付业务，请选择其他银行卡进行支付", "确定");
            return;
        }

        if(!$("#riskProtocolAgreement1").prev().children().get(0).checked){
            TopdeepCommon.showDialog("warning","请勾选诺安基金风险说明书","确定");
            return "请勾选诺安基金风险说明书";
        }

        var buyMoney=$(".purchaseMoney").val()*1;
        

        if(!$("#custRiskLevel").val()||"0"==$("#needFillCustInfo").val()){
            $("#toRiskTest").show();
            return false;
        }
        if("0"==$("#valiDateExpire").val()){
            $("#fillValiDate").show();
            return false;
        }

        if(Purchase.checkPurchaseInput()!=""){
            TopdeepCommon.showDialog("fail", Purchase.checkPurchaseInput(), "确定");
            return;
        }
        if(Purchase.professionflag=="1"){
            $("#buyflag").val("0");
            if(Purchase.age>=60){
                $("#riskWarning_olderThan60").show();
                Purchase.setInterval1($("#continueTrade3"),$("#continueTrade4"));
            }else{
                Purchase.goStep2();
            }

        }else{
            if(Purchase.custRisk*1==1){
                if(Purchase.fundRisk>Purchase.custRisk){
                    $("#stopWarning").show();
                }else if(Purchase.age>=60){
                    $("#riskWarning_olderThan60").show();
                    Purchase.setInterval1($("#continueTrade3"),$("#continueTrade4"));
                }else{
                    Purchase.goStep2();
                }
            }else if(Purchase.custRisk*1==5){
                if(Purchase.fundRisk==Purchase.custRisk){
                    $("#highriskwarnflag").val("1")
                    $("#highRiskWarning").show();
                }else if(Purchase.age>=60){
                    $("#riskWarning_olderThan60").show();
                    Purchase.setInterval1($("#continueTrade3"),$("#continueTrade4"));
                }else{
                    Purchase.goStep2();
                }
            }else{
                if(Purchase.fundRisk>Purchase.custRisk){
                    $("#riskWarning").show();

                    if(Purchase.fundRisk*1==5){
                        $("#highriskwarnflag").val("1");
                    }
                }else if(Purchase.age>=60){
                    $("#riskWarning_olderThan60").show();
                    Purchase.setInterval1($("#continueTrade3"),$("#continueTrade4"));
                }else{
                    Purchase.goStep2();
                }
            }
        }
    });

    $("#stopReSign").click(function(){
        $("#reSign").hide();
    })
    $("#gotoReSign").click(function(){
        $("#reSign").hide();
        //window.location.href = "https://service.allinpay.com:400/fps-resign/";
        window.open("https://service.allinpay.com:400/fps-resign/");
    })

    $(".stopTrade").click(function(){
        $("#stopWarning").hide();
        $("#highRiskWarning").hide();
        $("#riskWarning").hide();
    })

    $(".continueTrade").click(function(){
        if(Purchase.fundRisk>Purchase.custRisk){
            $("#buyflag").val("1")
        }
        $("#stopWarning").hide();
        $("#highRiskWarning").hide();
        $("#riskWarning").hide();
        if($("#highriskwarnflag").val()=="1"){
            $("#riskConfirm1").show();
            Purchase.setInterval1($("#continueTrade1"),$("#continueTrade2"))
        }else{
            $("#riskConfirm").show();
            Purchase.setInterval1($("#continueTrade5"),$("#continueTrade6"))
        }
        Purchase.goStep2();
    })

    $("#stopTrade").click(function(){
        $("#riskConfirm").hide();
        Purchase.showStep(1);
    })

    $("#continueTrade").click(function(){
        $("#riskConfirm").hide();
    })

    $("#continueTrade3").click(function(){
        var fundcode=Purchase.fundCode;
        var custrisk=Purchase.custRisk;
        var fundrisk=Purchase.fundRisk;
        var age=Purchase.age;
        var action="1";
        if(Purchase.flag){
            Purchase.flag=false;
            document.getElementById("continueTrade3").style.background="gray";
            Purchase.goStep2();
            $("#riskWarning_olderThan60").hide();
            Purchase.InsertClick(fundcode,custrisk,fundrisk,age,action);
        }

    })

    $("#stopTrade1").click(function(){
        $("#riskConfirm1").hide();
        Purchase.showStep(1);
    })

    Purchase.InsertClick=function(fundcode,custrisk,fundrisk,age,action){
        $.ajax({
            type : "POST",
            url : Purchase.contextPath + "/t/purchase!ajaxInsertClick.action",
            data :{"fundCode":fundcode,"custrisk":custrisk,"fundrisk":fundrisk,"action":action,"age":age},
            datatype : "json",
            success : function(result) {

                try {
                    if (result.success) {
                        Purchase.flag=true;

                        document.getElementById("continueTrade3").style.background="#ff8027";
                    }
                } catch (e) {
                    return false;
                }
            },
            error : function() {
                return false;
            }

        });

    }

    Purchase.CancelClick=function(fundcode,custrisk,fundrisk,age,action){
        $.ajax({
            type : "POST",
            url : Purchase.contextPath + "/t/purchase!ajaxInsertClick.action",
            data :{"fundCode":fundcode,"custrisk":custrisk,"fundrisk":fundrisk,"action":action,"age":age},
            datatype : "json",
            success : function(result) {

                try {
                    if (result.success) {
                        Purchase.flag=true;

                        document.getElementById("cancel_order").style.background="#39a1ea";
                    }
                } catch (e) {
                    return false;
                }
            },
            error : function() {
                return false;
            }

        });

    }

    $("#continueTrade1").click(function(){
        $("#riskConfirm1").hide();
    })

    $("#continueTrade5").click(function(){
        $("#riskConfirm").hide();
    })

    Purchase.goStep2 = function(){
        var radio=document.getElementsByName("moneyFrom");

        var checkvalue;
        for(var i=0;i<radio.length;i++){
            if(radio[i].checked){
                checkvalue = radio[i].value;

            }
        }
        if(checkvalue=="choseOnlinePay"||checkvalue=="currency") {
            $("#fundTypeName2").html(Purchase.fundName+"("+Purchase.fundCode+")");
            $("#purchaseMoney2").html((Purchase.money*1).toFixed(2)+"元");
            $("#formalWriting2").html(Purchase.money_zh);
            $("#moneyFrom2").html('<i class="bank-b'+Purchase.bankCode+'"></i>'+Purchase.transactionsName);
            $("#tradePwd").val("");
            $('html,body').animate({scrollTop:0},'slow');
            if(Purchase.fundType!="2"){
                $("#confirmDateDesc").html("确认基金份额");
            }
            Purchase.showStep(2);
        }else if(checkvalue=="choseRmemitPay") {
            $("#fundTypeName5").html(Purchase.fundName+"("+Purchase.fundCode+")");
            $("#purchaseMoney5").html((Purchase.money*1).toFixed(2)+"元");
            $("#formalWriting5").html(Purchase.money_zh);
            $("#moneyFrom5").html('<i class="bank-b'+Purchase.bankCode+'"></i>'+Purchase.transactionsName);
            $("#tradePwd5").val("");
            $('html,body').animate({scrollTop:0},'slow');
            if(Purchase.fundType!="2"){
                $("#confirmDateDesc5").html("确认基金份额");
            }
            Purchase.showStep(5);
        }


    }




    $("#goToPurchase").click(function(){
        if(Purchase.sendTradeMsg&&Purchase.sendTradeMsgBuyLimit*1<Purchase.money*1&&Purchase.curCardMobile&&Purchase.useCurrency==0){
            $(".verifyCodePic").attr("src",Purchase.contextPath+"/v/VerifyCodeServlet.action?v="+new Date().getTime());
            Purchase.showStep(4);
        }else{
            Purchase.ajaxPurchase();
        }
    });
    $("#goToPurchase5").click(function(){
        if(Purchase.sendTradeMsg&&Purchase.sendTradeMsgBuyLimit*1<Purchase.money*1&&Purchase.curCardMobile&&Purchase.useCurrency==0){
            $(".verifyCodePic").attr("src",Purchase.contextPath+"/v/VerifyCodeServlet.action?v="+new Date().getTime());
            Purchase.showStep(6);
        }else{
            Purchase.ajaxPurchase5();
        }
    });
    $("#goBack").click(function(){
        Purchase.showStep(1);
    })
    $("#goBack5").click(function(){
        Purchase.showStep(1);
    })
    $("#goBack1").click(function(){
        Purchase.showStep(2);
    })
    Purchase.ajaxQueryFundType();
    Purchase.fundCode = fundCode;
    Purchase.transactionsCode = transactionsCode;
    if(fundName != null && fundName != ""){
        $("#selectedFund").html(fundName);
    }

    $(".fundOrder").click(function(){
        $(this).siblings().find("div").removeClass("s-one");
        $(this).siblings().find("div").removeClass("s-two");
        var sortType=$(this).attr("name");
        //
        var order =1;
        if($(this).find("div").attr("class")=='fund-value s-two'){
            $(this).find("div").removeClass("s-two");
            $(this).find("div").addClass("s-one");
            order =2;//降序
        }else if($(this).find("div").attr("class")=='fund-value s-one'){
            $(this).find("div").removeClass("s-one");
            $(this).find("div").addClass("s-two");
            order =1;//升序
        }else{
            $(this).find("div").removeClass("s-one");
            $(this).find("div").removeClass("s-two");
            $(this).find("div").addClass("s-one");
//			order =3;
            order =2;
        }
        //排序
        TopdeepCommon.sortFund(Purchase.fundList,sortType,order);
        var searchFundType="";
        $(".fundType").each(function() {
            if ($(this).hasClass("active")) {
                searchFundType = $(this).attr("fundType");
            }
        });
        var searchKeyword = $("#searchKeyword").val();
        Purchase.setFund(searchFundType,searchKeyword);
    })



    $("#getVerifyCode").click(function(){
        var checkUserInput = Purchase.checkPurchaseInput(4);
        if(checkUserInput){
            TopdeepCommon.showDialog("warning",checkUserInput,"确定");
            return ;
        }
        var obj1 = $(this);
        var obj2 = $("#sending");
        Purchase.sendMsg = true;
        Purchase.ajaxSendVerifyCode(obj1,obj2);
    });

    $("#confirmProtocol3").click(function(){
        $($("#riskProtocolAgreement").prev().children().get(0)).prop("checked",true);
        Purchase.showStep(1);
    })

    $("#goNextStep").click(function(){
        if(!Purchase.sendMsg){
            TopdeepCommon.showDialog("warning","请获取手机验证码","确定");
            return ;
        }
        var checkUserInput = Purchase.checkPurchaseInput(Purchase.currStep);
        if(!checkUserInput){
            checkUserInput = $("verifyCode").val()==""?"请输入手机验证码":"";
        }
        if(checkUserInput){
            TopdeepCommon.showDialog("warning",checkUserInput,"确定");
            return ;
        }
        Purchase.ajaxPurchase();
    });

    /*点击下拉框事件*/
    $("#selectPapers").on("click", function () {
        var $selectList = $("#papersList");
        if(Purchase.slide=="up"){
            $selectList.slideUp();
            Purchase.slide="down";
        } else{
            $selectList.slideDown();
            Purchase.slide="up";
        }
        $selectList.find("li").on("click", function () {
            var account = Purchase.bankCards[$(this).attr("value")];
            //add by wangpingfei 20180409 添加暂停支付的银行网点判断
//            for(var i =0;i<Purchase.suspendChannelIdList.length;i++){
//                suspendChannelId = Purchase.suspendChannelIdList[i];
//                if(suspendChannelId==account.channelId){
//                    TopdeepCommon.showDialog("fail","该银行已经暂停基金支付业务，请选择其他银行卡进行支付", "确定");
//                    return;
//                }
//            }
            Purchase.no = $(this).attr("value");
            var radio=document.getElementsByName("moneyFrom");

            var checkvalue;
            for(var i=0;i<radio.length;i++){
                if(radio[i].checked){
                    checkvalue = radio[i].value;

                }
            }
            if(checkvalue=="choseOnlinePay") {

                /*如果选择了在线支付，则修改银行卡相关全局变量信息*/

                Purchase.transactionsName = account.transactionsName+account.bankAccount.substring((account.bankAccount.length - 4));
                Purchase.transactionsAccount = account.transactionsAccount;
                Purchase.curCardMobile = account.cardMobile;
                Purchase.bankCode=account.bankNo;
                Purchase.currentPerchaseChannelId= account.channelId;
                $("#remit").hide();
            }

            var account = Purchase.bankCards[$(this).attr("value")];
            /*修改折扣信息*/
            if(Purchase.fundCode=='320013'){
                $("#discount").html("0折");
                Purchase.discount=0 ;
            }else{
                $("#discount").html(account.discountInfo);
            }

            //$("#idType_select").val($(this).attr("value"));
            $("#selectPapers").html($(this).html());

            $selectList.slideDown();
            Purchase.slide="up";
        })
    });
    /*点击下拉框事件*/
    $("#rSelectPapers").on("click", function () {
        var $selectList = $("#rPapersList");
        if(Purchase.slide1=="up"){
            $selectList.slideUp();
            Purchase.slide1="down";
        } else{
            $selectList.slideDown();
            Purchase.slide1="up";
        }
        $selectList.find("li").on("click", function () {
            var account = Purchase.bankCards[$(this).attr("value")];
            //add by wangpingfei 20180409 添加暂停支付的银行网点判断
//            for(var i =0;i<Purchase.suspendChannelIdList.length;i++){
//                suspendChannelId = Purchase.suspendChannelIdList[i];
//                if(suspendChannelId==account.channelId){
//                    TopdeepCommon.showDialog("fail","该银行已经暂停基金支付业务，请选择其他银行卡进行支付", "确定");
//                    return;
//                }
//            }
            Purchase.no2 = $(this).attr("value");
            var radio=document.getElementsByName("moneyFrom");

            var checkvalue;
            for(var i=0;i<radio.length;i++){
                if(radio[i].checked){
                    checkvalue = radio[i].value;

                }
            }
            if(checkvalue=="choseRmemitPay") {
                var account = Purchase.bankCards[Purchase.no2];

                /*如果选择了汇款支付，则修改银行卡相关全局变量信息*/

                Purchase.transactionsName = account.transactionsName+account.bankAccount.substring((account.bankAccount.length - 4));
                Purchase.transactionsAccount = account.transactionsAccount;
                Purchase.curCardMobile = account.cardMobile;
                Purchase.bankCode=account.bankNo;
                Purchase.currentPerchaseChannelId= "";
                $("#remit").show();

            }
            var account = Purchase.bankCards[$(this).attr("value")];
            /*修改折扣信息*/
            $("#remitDiscount").html("0折");
            //$("#idType_select").val($(this).attr("value"));
            $("#rSelectPapers").html($(this).html());

            $selectList.slideDown();
            Purchase.slide1="up";
        })
    });
}



Purchase.setInterval1 = function(obj1,obj2){
    clearInterval(Purchase.Interval1);
    obj1.hide();
    obj2.show();
    var time = 10;
    obj2.html("确认并继续(" + time + "s)");
    Purchase.Interval1 = setInterval(function() {
        if (time <= 0) {
            obj1.show();
            obj2.hide();
            clearInterval(Purchase.Interval1);
        } else {
            time--;
            obj2.html("确认并继续(" + time + "s)");
        }
    },1000);
};


Purchase.setInterval = function(obj1,obj2){
    clearInterval(Purchase.Interval);
    obj1.hide();
    obj2.show();
    var time = Purchase.timeout;
    obj2.val("(" + time + ")");
    Purchase.Interval = setInterval(function() {
        if (time <= 0) {
            obj1.show();
            obj2.hide();
            clearInterval(Purchase.Interval);
        } else {
            time--;
            obj2.html("(" + time + ")");
        }
    },1000);
};


Purchase.ajaxSendVerifyCode = function(obj1,obj2){
    TopdeepCommon.showLoading();
    $.ajax({
        type : "POST",
        url : Purchase.contextPath + "/t/purchase!ajaxSendVerifyCode.action",
        data :{"cardMobile":$("#cardMobile").val(),"pictureCode":$("#pictureCode").val()},
        datatype : "json",
        success : function(result) {
            TopdeepCommon.hideLoading();
            try {
                if (result.success) {
                    Purchase.setInterval(obj1,obj2);
                    TopdeepCommon.showDialog("success","发送成功","确定");
                } else {
                    $(".verifyCodePic").attr("src",Purchase.contextPath+"/v/VerifyCodeServlet.action?v="+new Date().getTime());
                    obj1.show();
                    obj2.hide();
                    TopdeepCommon.showDialog("fail",result.tipMessage,"确定");
                }
            } catch (e) {
                TopdeepCommon.showDialog("fail","发送失败","确定");
                obj1.show();
                obj2.hide();
            }
        },
        error : function() {
            TopdeepCommon.hideLoading();
            TopdeepCommon.showDialog("fail","发送失败","确定");
            obj1.show();
            obj2.hide();
        }

    });
};

//
//int typeInSearch = 0;
//// 基金名称是否在搜索范围内
//int nameInSearch = 0;
//if (!StringUtils.isNullOrEmpty(req.getSearchFundType())) {
//	if ("yx".equals(req.getSearchFundType())) {
//		typeInSearch = 1;
//	} else if (item.getFundType().equals(req.getSearchFundType())) {
//		typeInSearch = 2;
//	}
//} else {
//	typeInSearch = 3;
//}
//if (!StringUtils.isNullOrEmpty(req.getSearchKeyword())) {
//	if (item.getFundName().indexOf(req.getSearchKeyword()) > -1) {
//		nameInSearch = 1;
//	}
//	if (item.getFundCode().indexOf(req.getSearchKeyword()) > -1) {
//		nameInSearch = 2;
//	}
//} else {
//	nameInSearch = 3;
//}
//if (item.getFundCode().equals(req.getFundCode())) {
//	res.setFundName(item.getFundName());
//}
//if (nameInSearch != 0 && typeInSearch != 0) {
//	canTradeList.add(item);
//}

Purchase.ajaxQueryFundList = function(searchFundType) {
    var searchKeyword = $("#searchKeyword").val();
    if(Purchase.fundList.length>0){
        Purchase.setFund(searchFundType,searchKeyword);
    }else{
        Purchase.fundListLoading = false;
        TopdeepCommon.showLoading();
        $.ajax({
            type : "POST",
            url : Purchase.contextPath
                + "/t/purchase!ajaxQueryFundList.action",
            data : {
                "fundCode" : Purchase.fundCode,
                "searchKeyword" : searchKeyword,
                "searchFundType" : searchFundType
            },
            datatype : "json",
            success : function(result) {
                Purchase.fundListLoading = true;
                if(Purchase.checkLoading()){
                    TopdeepCommon.hideLoading();
                }
                try {
                    if (result.success) {
                        if(result.fundName){
                            Purchase.fundName = result.fundName;
                        }

                        Purchase.fundList = result.fundList;
                        Purchase.exFundList = result.exFundList;
                        for(var i=0;i<Purchase.fundList.length;i++){
                            Purchase.fundList[i].isYx = false;
                            for(var j=0;j<Purchase.exFundList.length;j++){
                                if(Purchase.fundList[i].fundCode==Purchase.exFundList[j].fundCode){
                                    Purchase.fundList[i].isYx = true;
                                    break;
                                }
                            }
                        }
                        TopdeepCommon.sortFund(Purchase.fundList,"year1ud",2);
                        Purchase.setFund(searchFundType,searchKeyword);
                    } else {
                        TopdeepCommon.showDialog("fail", "获取基金列表失败:"+result.tipMessage, "确定");
                    }
                } catch (e) {
                    TopdeepCommon.showDialog("fail", "获取基金列表失败:"+e.message, "确定");
                }
            },
            error : function() {
                TopdeepCommon.showDialog("fail", "获取基金列表失败", "确定");
            }
        });
    }
}


Purchase.setFund = function(searchFundType,searchKeyword){

    var pageData = Purchase.fundList;
    var fundPageHtml = '';
    for (var i = 0; i < pageData.length;i++) {
        if(searchFundType&&searchFundType!="yx"){
            if(searchFundType!=pageData[i].fundType){
                continue;
            }
        }else if(searchFundType){
            if(!pageData[i].isYx){
                continue;
            }
        }
        if(pageData[i].fundType=="2"){
            continue;
        }
        if(searchKeyword != ""){
            if((pageData[i].fundName+"基金").indexOf(searchKeyword) > -1 || pageData[i].fundCode.indexOf(searchKeyword) > -1 || pinyin.getCamelChars(pageData[i].fundName).toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1 ){

            }else{
                continue;
            }
        }

        fundPageHtml += '<tr>';
        fundPageHtml += '<td class="fundRiskValue" style="display:none">'+pageData[i].riskLevel+'</td>';
        fundPageHtml += '<td class="choseFundName">'+pageData[i].fundName+'</td>';
        fundPageHtml += '<td class="choseFundCode">'+pageData[i].fundCode+'</td>';
        if(pageData[i].priceDate){
            fundPageHtml += '<td>'+pageData[i].netValue+'('+TopdeepCommon.DateFormatter(new Date(pageData[i].priceDate),"yyyy-MM-dd")+')</td>';
        }else{
            fundPageHtml += '<td>'+pageData[i].netValue+'</td>';
        }
        if(pageData[i].year1ud&&pageData[i].year1ud!='--'){
            if(pageData[i].year1ud.indexOf("-")>-1&&!pageData[i].year1ud.indexOf("--")>-1){
                fundPageHtml += '<td class="green">'+pageData[i].year1ud+'%</td>';
            }else{
                fundPageHtml += '<td class="red">'+pageData[i].year1ud+'%</td>';
            }
        }else{
            fundPageHtml += '<td class="red">'+pageData[i].year1ud+'</td>';
        }
        if(pageData[i].month1ud&&pageData[i].month1ud!='--'){
            if(pageData[i].month1ud.indexOf("-")>-1&&!pageData[i].month1ud.indexOf("--")>-1){
                fundPageHtml += '<td class="green">'+pageData[i].month1ud+'%</td>';
            }else{
                fundPageHtml += '<td class="red">'+pageData[i].month1ud+'%</td>';
            }
        }else{
            fundPageHtml += '<td class="red">'+pageData[i].month1ud+'</td>';
        }
        if(pageData[i].day1ud&&pageData[i].day1ud!='--'){
            if(pageData[i].day1ud.indexOf("-")>-1&&!pageData[i].day1ud.indexOf("--")>-1){
                fundPageHtml += '<td class="green">'+pageData[i].day1ud+'%</td>';
            }else{
                fundPageHtml += '<td class="red">'+pageData[i].day1ud+'%</td>';
            }
        }else{
            fundPageHtml += '<td class="red">'+pageData[i].day1ud+'</td>';
        }
        if(pageData[i].canPurchase=="1"){
            fundPageHtml += '<td class="transactionsCode" style="display:none;">002</td>';
        }else if(pageData[i].canSubscribe=="1"){
            fundPageHtml += '<td class="transactionsCode" style="display:none;">001</td>';
        }
        if(pageData[i].fundCode==Purchase.fundCode){
            Purchase.fundfee = pageData[i].fundfee;
        }
        fundPageHtml += '<td class="fundfee" style="display:none;">'+pageData[i].fundfee+'</td>';
        fundPageHtml += '<td class="choseFundType" style="display:none;">'+pageData[i].fundType+'</td>';
        fundPageHtml += '<td>';
        if(pageData[i].canPurchase=="1"||pageData[i].canSubscribe=="1"){
            fundPageHtml += '<a class="btn-orange fund-chose" href="javascript:;">选择</a>';
        }else{
            fundPageHtml += '<a class="btn-orange fund-chose btn-gray" href="javascript:;">选择</a>';
        }
        fundPageHtml += '</td>';
        fundPageHtml += '</tr>';
    }
    var currencyFundPageHtml = '';
    for (var i = 0; i < pageData.length;i++) {
        if(pageData[i].fundType!="2"||searchFundType=="yx"){
            continue;
        }
        if(searchKeyword != ""){
            if((pageData[i].fundName+"基金").indexOf(searchKeyword) > -1 || pageData[i].fundCode.indexOf(searchKeyword) > -1 || pinyin.getCamelChars(pageData[i].fundName).toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1 ){

            }else{
                continue;
            }
        }
        currencyFundPageHtml += '<tr>';
        currencyFundPageHtml += '<td class="fundRiskValue" style="display:none">'+pageData[i].riskLevel+'</td>';
        currencyFundPageHtml += '<td class="choseFundName">'+pageData[i].fundName+'</td>';
        currencyFundPageHtml += '<td class="choseFundCode">'+pageData[i].fundCode+'</td>';
        if(pageData[i].priceDate){
            currencyFundPageHtml += '<td class="red">'+pageData[i].netValue+'('+TopdeepCommon.DateFormatter(new Date(pageData[i].priceDate),"yyyy-MM-dd")+')</td>';
        }else{
            currencyFundPageHtml += '<td class="red">'+pageData[i].netValue+'</td>';
        }
        if(pageData[i].canPurchase=="1"){
            currencyFundPageHtml += '<td class="transactionsCode" style="display:none;">002</td>';
        }else if(pageData[i].canSubscribe=="1"){
            currencyFundPageHtml += '<td class="transactionsCode" style="display:none;">001</td>';
        }
        if(pageData[i].fundCode==Purchase.fundCode){
            Purchase.fundfee = pageData[i].fundfee;
        }
        if(pageData[i].totalNetValue&&pageData[i].totalNetValue!="--"){
            currencyFundPageHtml += '<td class="red">'+pageData[i].totalNetValue+'%</td>';
        }else{
            currencyFundPageHtml += '<td class="red"></td>';
        }
        currencyFundPageHtml += '<td class="fundfee" style="display:none;">'+pageData[i].fundfee+'</td>';
        currencyFundPageHtml += '<td class="choseFundType" style="display:none;">'+pageData[i].fundType+'</td>';
        currencyFundPageHtml += '<td>';
        if(pageData[i].canPurchase=="1"||pageData[i].canSubscribe=="1"){
            currencyFundPageHtml += '<a class="btn-orange fund-chose" href="javascript:;">选择</a>';
        }else{
            currencyFundPageHtml += '<a class="btn-orange fund-chose btn-gray" href="javascript:;">选择</a>';
        }
        currencyFundPageHtml += '</td>';
        currencyFundPageHtml += '</tr>';
    }
    if(searchFundType=="2"){
        $(".fundTable").hide();
        $("#currencyFundPage").html(currencyFundPageHtml);
        $(".currencyTable").show();
    }else if(searchFundType==""||searchFundType=="yx"){
        $("#fundPage").html(fundPageHtml);
        $(".fundTable").show();
        $("#currencyFundPage").html(currencyFundPageHtml);
        if(currencyFundPageHtml!=""){
            $(".currencyTable").show();
        }else{
            $(".currencyTable").hide();
        }
    }else{
        $(".currencyTable").hide();
        $("#fundPage").html(fundPageHtml);
        $(".fundTable").show();
    }
    if(Purchase.fundName){
        $("#selectedFund").html(Purchase.fundName);
    }
    Purchase.choseFund();
    if(Purchase.fundCode&&Purchase.fundCode!=""){
        Purchase.ajaxQueryFundBuyInfo();
//		Purchase.ajaxRiskQuery(Purchase.fundCode);
    }

}


Purchase.ajaxQueryFundType = function(searchFundType) {
    $.ajax({
        type : "POST",
        url : Purchase.contextPath
            + "/t/purchase!ajaxQueryFundType.action",
        data : {},
        datatype : "json",
        success : function(result) {
            try {
                if (result.success) {
                    var titleHtml = '';
                    var titleData = result.fundTypeList;
                    titleHtml += '<li class="fundType active" fundType=""><a href="javascript:;">全部基金</a></li>';
                    titleHtml += '<li class="fundType" fundType="yx"><a href="javascript:;">优选基金</a></li>';
                    for ( var i=0;i<titleData.length;i++) {
                        titleHtml += '<li class="fundType" fundType="'
                            + titleData[i].value + '"><a href="javascript:;">'
                            + titleData[i].name+ '</a></li>';
                    }
                    $("#fundTypeTitle").html(titleHtml);
                    Purchase.ajaxQueryFundList("");
                    Purchase.bindMethods();
                } else {
                    TopdeepCommon.showDialog("fail", "查询基金类型失败:"+result.tipMessage, "确定");
                }
            } catch (e) {
                TopdeepCommon.showDialog("fail", "查询基金类型失败:"+e.message, "确定");
            }
        },
        error : function() {
            TopdeepCommon.showDialog("fail", "查询基金类型失败", "确定");
        }
    });
}

Purchase.ajaxQueryFundBuyInfo = function() {
    Purchase.fundTypeLoading = false;
    TopdeepCommon.showLoading();
    $.ajax({
        type : "POST",
        url : Purchase.contextPath
            + "/t/purchase!ajaxQueryFundBuyInfo.action",
        data : {
            "fundCode" : Purchase.fundCode,
            "transactionsCode" : Purchase.transactionsCode
        },
        datatype : "json",
        success : function(result) {
            Purchase.fundTypeLoading = true;
            try {
                if (result.success) {
                    Purchase.promoteChannelMap=result.promoteChannelMap;
                    Purchase.suspendChannelIdList=result.suspendChannelIdList;
                    Purchase.promoteLimiteMap = result.promoteLimitMap;
                    var detail;
                    Purchase.currencyAssets = result.currencyAssets;
                    Purchase.normalFundBuyLimit = result.normalFundBuyLimit;
                    Purchase.purchaseFundBuyInfo = result.purchaseFundBuyInfo;

                    $("#currencyFee").val(result.currencyPurchaseFee);
                    if(!result.fundFee){
                        Purchase.fundfee = "";
                    }else{
                        Purchase.fundfee = result.fundFee;
                    }
                    if(Purchase.purchaseFundBuyInfo){
                        Purchase.bankCards = Purchase.purchaseFundBuyInfo.detail;
                        detail = Purchase.purchaseFundBuyInfo.detail;
                        var moneyFromHtml = "";
                        var rMoneyFromHtml = "";


                        for(var i=0;i<detail.length;i++){
                            if(i==0){
                                Purchase.no =0;
                                Purchase.no2 =0;
                                /*修改折扣信息*/
                                if(Purchase.fundCode=='320013'){
                                    $("#discount").html("0折");
                                }else{
                                    $("#discount").html(detail[i].discountInfo);

                                }

                                $("#remitDiscount").html("0折");
                                //$("#idType_select").val($(this).attr("value"));
                                var firstHtml = "";
                                var secondHtml = "";
                                if(Purchase.ifSuspendChannel(detail[i].channelId)){
                                    firstHtml +='<a href="javascript:;">'+'<i class="bank-b'+detail[i].bankNo+'"></i>'+
                                        detail[i].transactionsName+detail[i].bankAccount.substring((detail[i].bankAccount.length - 4),detail[i].bankAccount.length)+'&nbsp&nbsp'+'已下线'
                                        +'&nbsp&nbsp'
                                        +'</a>';
                                }else{
                                    firstHtml +='<a href="javascript:;">'+'<i class="bank-b'+detail[i].bankNo+'"></i>'+
                                        detail[i].transactionsName+detail[i].bankAccount.substring((detail[i].bankAccount.length - 4),detail[i].bankAccount.length)+'&nbsp&nbsp'+detail[i].purchaseLimit
                                        +'&nbsp&nbsp'
                                        +'</a>';
                                }

                                    if(Purchase.containsPromoteChannel(detail[i].channelId)){
                                        firstHtml +='<a style="display:inline;text-align:center;color:#FF463D;border:2px solid #FF463D;padding:0.1px 3px;width:300px;border-radius:7px; " class="promoteLimit" no="'+i+'"　href="javascript:void(0)">'
                                            +'可提升额度'
                                            +'</a>';}
                                    else if(TopdeepCommon.ifReSignChannel(detail[i].channelId,result.reSignSiteMap)){
                                        firstHtml +='<a style="display:inline;text-align:center;color:#FF463D;border:2px solid #FF463D;padding:0.1px 3px;width:300px;border-radius:7px; " class="needReSign" transactionsName="'+detail[i].transactionsName+'"　href="javascript:void(0)">'
                                            +'需重新鉴权'
                                            +'</a>';      }

                                $("#selectPapers").html(firstHtml);
                                    secondHtml+='<a href="javascript:;">'+'<i class="bank-b'+detail[i].bankNo+'"></i>'+
                                        detail[i].transactionsName+detail[i].bankAccount.substring((detail[i].bankAccount.length - 4),detail[i].bankAccount.length);
                                    +'</a>';
                                $("#rSelectPapers").html(secondHtml);

                            }
                            moneyFromHtml +='<li value='+i+'>';
                            if(Purchase.ifSuspendChannel(detail[i].channelId)){
                                moneyFromHtml +='<a href="javascript:;">'+'<i class="bank-b'+detail[i].bankNo+'"></i>'+
                                    detail[i].transactionsName+detail[i].bankAccount.substring((detail[i].bankAccount.length - 4),detail[i].bankAccount.length)+'&nbsp&nbsp'+'已下线'
                                    +'&nbsp&nbsp'
                                    +'</a>';
                            }else{
                                moneyFromHtml +='<a href="javascript:;">'+'<i class="bank-b'+detail[i].bankNo+'"></i>'+
                                    detail[i].transactionsName+detail[i].bankAccount.substring((detail[i].bankAccount.length - 4),detail[i].bankAccount.length)+'&nbsp&nbsp'+detail[i].purchaseLimit
                                    +'&nbsp&nbsp'
                                    +'</a>';
                            }
                                if(Purchase.containsPromoteChannel(detail[i].channelId)){
                                    moneyFromHtml +='<a style="display:inline;text-align:center;color:#FF463D;border:2px solid #FF463D;padding:0.1px 3px;width:300px;border-radius:7px; " class="promoteLimit" no="'+i+'"　href="javascript:void(0)">'
                                        +'可提升额度'
                                        +'</a>';
                                } else if(TopdeepCommon.ifReSignChannel(detail[i].channelId,result.reSignSiteMap)){
                                    moneyFromHtml +='<a style="display:inline;text-align:center;color:#FF463D;border:2px solid #FF463D;padding:0.1px 3px;width:300px;border-radius:7px; " class="needReSign" transactionsName="'+detail[i].transactionsName+'"　href="javascript:void(0)">'
                                        +'需重新鉴权'
                                        +'</a>';      }
                            moneyFromHtml +='</li>';
                            rMoneyFromHtml +='<li value='+i+'>';
                                rMoneyFromHtml +='<a href="javascript:;">'+'<i class="bank-b'+detail[i].bankNo+'"></i>'+
                                    detail[i].transactionsName+detail[i].bankAccount.substring((detail[i].bankAccount.length - 4),detail[i].bankAccount.length);
                                +'</a>';


                            rMoneyFromHtml +='</li>';

                            /*if(i%2==0){
                             moneyFromHtml += '<div class="finance-box-s">';
                             }
                             moneyFromHtml +=	'<label><input type="radio" name="moneyFrom" transactionsName="'+detail[i].transactionsName+'" transactionsAccount="'+detail[i].transactionsAccount+'" cardMobile="'+detail[i].cardMobile+'" discountInfo="'+detail[i].discountInfo+'"/>';
                             moneyFromHtml += '<span class="transactionsName">'+'<i class="bank-b'+detail[i].bankNo+'"></i>';
                             moneyFromHtml += detail[i].transactionsName+'('+detail[i].bankAccount.substring((detail[i].bankAccount.length - 4),detail[i].bankAccount.length)+')</span>';
                             if(Purchase.fundType!="2"){
                             moneyFromHtml += '<strong class="orange ">'+detail[i].discountInfo+'</strong><br/>';
                             }else{
                             moneyFromHtml += '<strong class="orange "></strong><br/>';
                             }
                             moneyFromHtml += '</label>';
                             if(i%2==1){
                             moneyFromHtml += '</div>';
                             }*/
                        }
                        moneyFromHtml +='</ul>';
                        rMoneyFromHtml +='</ul>';
                        $("#papersList").html(moneyFromHtml);
                        $("#rPapersList").html(rMoneyFromHtml);

                    }
                    var idTypeHtml = "";
                    $("#transactorIdTypeUl").html(idTypeHtml);
                    for(var j=0;j<result.idTypes.length;j++){
                        idTypeHtml+=' <li value="'+result.idTypes[j].baseInfoId+'"><a href="javascript:;">'+result.idTypes[j].baseInfoName+'</a></li>'
                    }
                    $("#transactorIdTypeUl").html(idTypeHtml);
                    Purchase.transactionsAccount = detail[0].transactionsAccount;
                    Purchase.curCardMobile = detail[0].cardMobile;
                    if(detail[0]&&detail[0].discountInfo!="0费率"){
                        if(Purchase.fundType=="2"){
                            Purchase.discount = 0;
                            $("#currencyPurchaseFee").hide();
                            $("#commissionCharge").hide();
                        }else{
                            if(Purchase.fundCode=='320013'){
                                Purchase.discount = "0折".replace("折","")*1;
                            }else{
                                Purchase.discount = detail[0].discountInfo.replace("折","")*1;
                            }

                            $("#currencyPurchaseFee").html($("#currencyFee").val()+"折");
                            //临时隐藏
//								$("#commissionCharge").show();
                        }
                    }else{
                        $("#currencyPurchaseFee").html("0费率");
                        Purchase.discount = 0;
                        $("#currencyPurchaseFee").show();
                        $("#commissionCharge").hide();
                    }
                    $("[name='moneyFrom']").on("click",function(){
                        if($(this).val()=="choseOnlinePay") {
                            var account = Purchase.bankCards[Purchase.no];
                            /*如果选择了在线支付，则修改银行卡相关全局变量信息*/

                            Purchase.transactionsName = account.transactionsName+account.bankAccount.substring((account.bankAccount.length - 4));
                            Purchase.transactionsAccount = account.transactionsAccount;
                            Purchase.curCardMobile = account.cardMobile;
                            Purchase.bankCode=account.bankNo;
                            Purchase.currentPerchaseChannelId= account.channelId;
                            var discountHtml = account.discountInfo;
                            if(discountHtml!="0费率"){
                                Purchase.discount = discountHtml.replace("折","")*1;
                            }else{
                                discountHtml="0折";
                                Purchase.discount = "0折";
                            }
                            Purchase.showCommissionCharge();
                            $("#remit").hide();
                            return;
                        }
                        if($(this).val()=="choseRmemitPay") {
                            var account = Purchase.bankCards[Purchase.no2];
                            /*如果选择了在线支付，则修改银行卡相关全局变量信息*/

                            Purchase.transactionsName = account.transactionsName+account.bankAccount.substring((account.bankAccount.length - 4));
                            Purchase.transactionsAccount = account.transactionsAccount;
                            Purchase.curCardMobile = account.cardMobile;
                            Purchase.bankCode=account.bankNo;
                            Purchase.currentPerchaseChannelId= "";
                            
                            var discountHtml = "0折";
                            $("#remit").show();
                            Purchase.showCommissionCharge();

                            return;
                        }
                        var discountHtml = $(this).attr("discountInfo");
                        Purchase.transactionsName = $(this).parent().find(".transactionsName").html();
                        Purchase.transactionsAccount = $(this).attr("transactionsAccount");
                        Purchase.curCardMobile = $(this).attr("cardMobile");
                        if(discountHtml!="0费率"){
                            Purchase.discount = discountHtml.replace("折","")*1;
                        }else{
                            Purchase.discount = 0;
                        }
                        Purchase.currentPerchaseChannelId="";
                        $("#remit").hide();
                        Purchase.showCommissionCharge();
                    })

                    $("#moneyFromList").show();
                    $(".purchaseMoney").attr("placeholder","购买起点>="+ result.normalFundBuyLimit);
                    $("#currencyAssets").html(Purchase.currencyAssets);
                    TopdeepCommon.hideLoading();
                    $("#currencyAccount").click();
                } else {
                    TopdeepCommon.hideLoading();
                    TopdeepCommon.showDialog("fail", "查询资金渠道失败:"+result.tipMessage, "确定");
                }
            } catch (e) {
                TopdeepCommon.hideLoading();
                TopdeepCommon.showDialog("fail", "查询资金渠道失败:"+e.message, "确定");
            }
        },
        error : function() {
            TopdeepCommon.hideLoading();
            TopdeepCommon.showDialog("fail", "查询资金渠道失败", "确定");
        }
    });
}
Purchase.choseFund = function(){
    $(".fund-chose").click(function(){
        if($(this).hasClass("btn-gray")){
            return;
        }
        if($(this).parent().parent().find(".choseFundCode").html()==Purchase.currencyFundCode){
            window.location.href = Purchase.contextPath + "/t/currencyPurchase.action?applysum="+$(".purchaseMoney").val();
        }
        $("#dialog").fadeOut(500);
        Purchase.fundName = $(this).parent().parent().find(".choseFundName").html();
        $("#selectedFund").html(Purchase.fundName);
        Purchase.fundCode = $(this).parent().parent().find(".choseFundCode").html();
        if(Purchase.fundCode=='163209'){
            $("#tips").show();
        }else{
            $("#tips").hide();
        }
        Purchase.transactionsCode = $(this).parent().parent().find(".transactionsCode").html();
        Purchase.fundfee = $(this).parent().parent().find(".fundfee").html();
        Purchase.fundType=$(this).parent().parent().find(".choseFundType").html();
        Purchase.ajaxQueryFundBuyInfo();
        $("#currencyAccount").prop("checked","checked");
        Purchase.showCommissionCharge();
//		Purchase.ajaxRiskQuery(Purchase.fundCode);

        Purchase.fundRisk=$(this).parent().parent().find(".fundRiskValue").html();
        if(Purchase.fundRisk*1==1){
            $(".fundRisk").html("（低）");
        }else if(Purchase.fundRisk*1==2){
            $(".fundRisk").html("（中低）");
        }else if(Purchase.fundRisk*1==3){
            $(".fundRisk").html("（中）");
        }else if(Purchase.fundRisk*1==4){
            $(".fundRisk").html("（中高）");
        }else{
            $(".fundRisk").html("（高）");
        }

    });
}

Purchase.bindMethods = function() {
    $(".fundType").mouseover(function() {
        $(".fundOrder").siblings().find("div").removeClass("s-one");
        $(".fundOrder").siblings().find("div").removeClass("s-two");
        $(".fundType").removeClass("active");
        $(this).addClass("active");
        Purchase.fundCode="";
        Purchase.ajaxQueryFundList($(this).attr("fundType"));
    });

    $("#searchKeyword").bind('input propertychange', function() {
        $("#fundTypeTitle").find("li").removeClass("active");
        $("#fundTypeTitle >:first ").addClass("active");
        Purchase.ajaxQueryFundList();
        Purchase.fundCode="";
        var searchFundType="";
        $(".fundType").each(function() {
            if ($(this).hasClass("active")) {
                searchFundType = $(this).attr("fundType");
            }
        });
        var searchKeyword = $("#searchKeyword").val();
        Purchase.setFund(searchFundType,searchKeyword);
    });

}

Purchase.showCommissionCharge = function(){
//	净申购金额＝申购金额/（1＋原申购费率*折扣）；
//	申购费用＝申购金额－净申购金额；
    var fee = Purchase.fundfee.replace("%","")*1/100;
    var oriPrice=0;
    if(Purchase.money!=undefined&&!isNaN(Purchase.money)){
//		oriPrice = (fee*Purchase.money).toFixed(2);
        oriPrice =	(Purchase.money - Purchase.money/(1+fee)).toFixed(2);
    }
    var nowPrice = (Purchase.money - Purchase.money/(1+fee*(Purchase.discount/10))).toFixed(2);
    var discountPrice = (oriPrice - nowPrice).toFixed(2);
    $("#oriPrice").html(oriPrice+"元");
    $("#nowPrice").html(nowPrice+"元");
    $("#discountPrice").html(discountPrice+"元");
    if(fee!=0&&Purchase.fundType!="2"||Purchase.discount == 0){
        if(Purchase.discount == 0){
            $("#commissionCharge").hide();
        }else{
            $("#commissionCharge").show();
        }
        $("#currencyPurchaseFee").show();
        $("strong.orange").show();
    }else{
        $("#commissionCharge").hide();
        $("strong.orange").hide();
        $("#currencyPurchaseFee").hide();
    }
    //临时隐藏
    $("#commissionCharge").hide();
}

Purchase.showStep = function(step){
    $(".step").hide();
    $("#step"+step).show();
    Purchase.currStep = step;
}

Purchase.checkPurchaseInput = function(){
    var dd =Purchase.transactionsName;
    var msg = "";
    var step = Purchase.currStep;
    var selectedFund = $("#selectedFund").html();
    Purchase.pwd = $("#tradePwd").val();
    /*$transactionsInfo = $("[name='moneyFrom']:checked");
     if($transactionsInfo.length!=0){
     Purchase.transactionsName=$transactionsInfo.parent().find(".transactionsName").html();
     }else{
     Purchase.transactionsName="";
     }*/
    if(step==1||step==4){
        if (selectedFund == "" || $.trim(selectedFund) == "" || Purchase.fundCode == null || Purchase.fundCode == "") {
            return "请选择购买基金";
        }
        if (Purchase.money == "" || $.trim(Purchase.money) == "") {
            return "请输入购买金额";
        }
        if(isNaN(Purchase.money)){
            return "请输入正确金额";
        }
        if(Purchase.money.substring(Purchase.money.length-1,Purchase.money.length)=="."){
            return "请输入正确金额";
        }
        if(Purchase.transactionsName==""||$.trim(Purchase.transactionsName) == ""){
            return "请选择资金渠道";
        }
        if(Purchase.money*1<Purchase.normalFundBuyLimit*1){
            return "购买金额不能小于最低限额"+Purchase.normalFundBuyLimit+"元";
        }
        if(isNaN(Purchase.money)){
            return "请输入正确金额";
        }
        if(Purchase.money<=0){
            return "请输入正确金额";
        }

        try{
            if(!/^\d+(\.\d{0,2})?$/.test(Purchase.money)){
                return "购买金额最多2位小数";
            }
        }catch(e){
            return "购买金额最多2位小数";
        }
        if(Purchase.transactionsName.indexOf("现金宝账户") > -1){
            //判定现金余额
            var buyMoney=$(".purchaseMoney").val()*1;
            var nowMoney=$("#currencyAssets").text()*1;
            if(buyMoney>nowMoney){
                return "余额不足";
            }

        }

    }else if(step==2||step==4){
        if(Purchase.pwd==""||$.trim(Purchase.pwd) == ""){
            return "请输入密码";
        }
        var riskLevelMatch=$("#riskLevelMatch").val();
        var checked=$("#riskLevelMatchCheck").prop("checked");
        if(riskLevelMatch != "1"){
            if(checked != true){
                return "请确认风险等级!";
            }
        }
    }
    if(step==4){
        if(!$("#cardMobile").val()){
            return "请输入银行卡绑定的手机号"
        }
        if(!$("#pictureCode").val()){
            return "请输入图形验证码"
        }
    }
    if(Purchase.transactionsName.indexOf("现金宝账户") < 0){
        Purchase.useCurrency="0";
    }else{
        Purchase.useCurrency="1";
    }
    return "";
}

Purchase.checkPurchaseInput6 = function(){
    var msg = "";
    var step = Purchase.currStep;
    var selectedFund = $("#selectedFund").html();
    Purchase.pwd = $("#tradePwd5").val();
    $transactionsInfo = $("[name='moneyFrom']:checked");
    /*if($transactionsInfo.length!=0){
        Purchase.transactionsName=$transactionsInfo.parent().find(".transactionsName").html();
    }else{
        Purchase.transactionsName="";
    }*/
    if(step==1||step==6){
        if (selectedFund == "" || $.trim(selectedFund) == "" || Purchase.fundCode == null || Purchase.fundCode == "") {
            return "请选择购买基金";
        }
        if (Purchase.money == "" || $.trim(Purchase.money) == "") {
            return "请输入购买金额";
        }
        if(isNaN(Purchase.money)){
            return "请输入正确金额";
        }
        if(Purchase.money.substring(Purchase.money.length-1,Purchase.money.length)=="."){
            return "请输入正确金额";
        }
        if(Purchase.transactionsName==""||$.trim(Purchase.transactionsName) == ""){
            return "请选择资金渠道";
        }
        if(Purchase.money*1<Purchase.normalFundBuyLimit*1){
            return "购买金额不能小于最低限额"+Purchase.normalFundBuyLimit+"元";
        }
        if(isNaN(Purchase.money)){
            return "请输入正确金额";
        }
        if(Purchase.money<=0){
            return "请输入正确金额";
        }

        try{
            if(!/^\d+(\.\d{0,2})?$/.test(Purchase.money)){
                return "购买金额最多2位小数";
            }
        }catch(e){
            return "购买金额最多2位小数";
        }
        if(Purchase.transactionsName.indexOf("现金宝账户") > -1){
            //判定现金余额
            var buyMoney=$(".purchaseMoney").val()*1;
            var nowMoney=$("#currencyAssets").text()*1;
            if(buyMoney>nowMoney){
                return "余额不足";
            }

        }

    }else if(step==5||step==6){
        if(Purchase.pwd==""||$.trim(Purchase.pwd) == ""){
            return "请输入密码";
        }
        var riskLevelMatch=$("#riskLevelMatch").val();
        var checked=$("#riskLevelMatchCheck").prop("checked");
        if(riskLevelMatch != "1"){
            if(checked != true){
                return "请确认风险等级!";
            }
        }
    }
    if(step==6){
        if(!$("#cardMobile6").val()){
            return "请输入银行卡绑定的手机号"
        }
        if(!$("#pictureCode6").val()){
            return "请输入图形验证码"
        }
    }
    if(Purchase.transactionsName.indexOf("现金宝账户") < 0){
        Purchase.useCurrency="0";
    }else{
        Purchase.useCurrency="1";
    }
    return "";
}

Purchase.ajaxPurchase5 = function(){
    if($("#childCust").val()=="0"&&$("#alertChildInput").is(":hidden")){
        $("#alertChildInput").show();
        return;
    }else{
        var tipmsg = TopdeepCommon.checkChildInput();
        if(tipmsg){
            TopdeepCommon.showDialog("warning",tipmsg,"确定");
            return ;
        }
        $("#alertChildInput").hide();
    }
    if(Purchase.checkPurchaseInput6()!=""){
        TopdeepCommon.showDialog("fail", Purchase.checkPurchaseInput6(), "确定");
        return;
    }
    TopdeepCommon.showLoading();
    $.ajax({
        type : "POST",
        url : Purchase.contextPath
            + "/t/purchase!ajaxPurchase.action",
        data : {
            "fundCode" : Purchase.fundCode,
            "applysum" : Purchase.money,
            "tradeAcc" : Purchase.transactionsAccount,
            "useCurrency" : Purchase.useCurrency,
            "tradePwd" : Purchase.pwd,
            "paytype": Purchase.payType,
            "cardMobile":$("#cardMobile").val(),
            "verifyCode":$("#verifyCode").val(),
            "pictureCode":$("#pictureCode").val(),
            "buyflag":$("#buyflag").val(),
            "highriskwarnflag":$("#highriskwarnflag").val(),
            "riskwarnflag":$("#riskwarnflag").val(),
            "transactorIdType":$("#transactorIdType").val(),
            "transactorIdNo":$("#transactorIdNo").val(),
            "transactorName":$("#transactorName").val()
        },
        datatype : "json",
        success : function(result) {
            TopdeepCommon.hideLoading();
            try {
                if (result.success) {
                    $("#custName7").html(result.customerName);
                    $("#transactionsDate7").html(TopdeepCommon.DateFormatter(new Date(result.purchaseOutPut.transactionsDate),"MM月dd日"));
                   /* $("#transactionsDate7").html(TopdeepCommon.DateFormatter(new Date(result.purchaseOutPut.operDateTime.substring(0,result.purchaseOutPut.operDateTime.length-3)),"yyyy-MM-dd"));*/
                    Purchase.showStep(7);
                } else {
                    TopdeepCommon.showDialog("fail", "购买基金失败:"+result.tipMessage, "确定");
                }
            } catch (e) {
                TopdeepCommon.showDialog("fail", "购买基金失败:"+e.message, "确定");
            }
        },
        error : function() {
            TopdeepCommon.hideLoading();
            TopdeepCommon.showDialog("fail", "获取银行卡列表失败", "确定");
        }
    });

}


Purchase.ajaxPurchase = function(){
    if($("#childCust").val()=="0"&&$("#alertChildInput").is(":hidden")){
        $("#alertChildInput").show();
        return;
    }else{
        var tipmsg = TopdeepCommon.checkChildInput();
        if(tipmsg){
            TopdeepCommon.showDialog("warning",tipmsg,"确定");
            return ;
        }
        $("#alertChildInput").hide();
    }
    if(Purchase.checkPurchaseInput()!=""){
        TopdeepCommon.showDialog("fail", Purchase.checkPurchaseInput(), "确定");
        return;
    }
	if(Purchase.fundCode == '006025' && Purchase.money > 1000){
		var tipmsg = '诺安优化配置混合该基金目前只支持购买不超过1000元'
		TopdeepCommon.showDialog("warning",tipmsg,"确定");
	     return
	}
    TopdeepCommon.showLoading();

    $.ajax({
        type : "POST",
        url : Purchase.contextPath
            + "/t/purchase!ajaxPurchase.action",
        data : {
            "fundCode" : Purchase.fundCode,
            "applysum" : Purchase.money,
            "tradeAcc" : Purchase.transactionsAccount,
            "useCurrency" : Purchase.useCurrency,
            "tradePwd" : Purchase.pwd,
            "cardMobile":$("#cardMobile").val(),
            "verifyCode":$("#verifyCode").val(),
            "pictureCode":$("#pictureCode").val(),
            "buyflag":$("#buyflag").val(),
            "highriskwarnflag":$("#highriskwarnflag").val(),
            "riskwarnflag":$("#riskwarnflag").val(),
            "transactorIdType":$("#transactorIdType").val(),
            "transactorIdNo":$("#transactorIdNo").val(),
            "transactorName":$("#transactorName").val()
        },
        datatype : "json",
        success : function(result) {
            TopdeepCommon.hideLoading();
            try {
                if (result.success) {
                    $("#custName").html(result.customerName);
                    $("#transactionsDate").html(result.purchaseOutPut.operDateTime.substring(0,result.purchaseOutPut.operDateTime.length-3));
                    $("#confirmDate").html(TopdeepCommon.DateFormatter(new Date(result.purchaseOutPut.confirmDate),"yyyy-MM-dd"));
                    $("#queryProfitDate").html(TopdeepCommon.DateFormatter(new Date(result.purchaseOutPut.queryProfitDate),"yyyy-MM-dd"));
                    if(Purchase.fundCode == '008328'){
                          $("#confirmDateDesc").html("确认基金份额")
                          $("#queryProfitDate").html("--")
                          $("#confirmDate").html("基金成立后")

                      }
					Purchase.showStep(3);
                } else if(result.tipMessage.indexOf("0862") != -1){
                    $("#reSign").show();
                } else {
                    TopdeepCommon.showDialog("fail", "购买基金失败:"+result.tipMessage, "确定");
                }
            } catch (e) {
                TopdeepCommon.showDialog("fail", "购买基金失败:"+e.message, "确定");
            }
        },
        error : function() {
            TopdeepCommon.hideLoading();
            TopdeepCommon.showDialog("fail", "获取银行卡列表失败", "确定");
        }
    });

}
//基金风险评测
//Purchase.ajaxRiskQuery=function(targetFundCode){
//	$.ajax({
//		type : "POST",
//		url :Purchase.contextPath+ "/t/purchase!ajaxRiskQuery.action",
//		data : {"fundCode":targetFundCode},
//		datatype : "json",
//		contentType : TopdeepCommon.contentType,
//		success : function(result) {
//			try {
//				if (!result.success) {
//					TopdeepCommon.hideLoading();
//					TopdeepCommon.showDialog("fail",result.tipMessage,"确定","","");
//				} else {
//					var riskLevelMatch = result.riskLevelMatch;
//					$("#riskLevelMatch").val(riskLevelMatch);
//					if(riskLevelMatch =='1'){
//						$("#riskLevelMatchdd").css("display","none");
//					}else{
//						$("#riskLevelMatchdd").css("display","block");
//					}
//				}
//			} catch (e) {
//				TopdeepCommon.hideLoading();
//			}
//		},
//		error : function() {
//			TopdeepCommon.hideLoading();
//		}
//	});
//}

Purchase.checkLoading=function(){
    return Purchase.fundListLoading&&Purchase.fundTypeLoading;
}

Purchase.containsPromoteChannel = function(channelId){
    for (var key in Purchase.promoteChannelMap) {
        if(channelId == key) return 1;
        // System.out.println(key + ":" + map.get(key));
    }
    return 0 ;
}


Purchase.getNewChannelId = function(channelId){
    for (var key in Purchase.promoteChannelMap) {
        if(channelId == key){
            return Purchase.promoteChannelMap[key];
        }
    }
    return "notFoundNewChannelId" ;
}


Purchase.ifSuspendChannel = function(channelId){
    for(var i =0;i<Purchase.suspendChannelIdList.length;i++){
        suspendChannelId = Purchase.suspendChannelIdList[i];
        if(suspendChannelId==channelId){
            return 1;
        }
    }
    return 0;
}
Purchase.getPromoteLimite = function(channelId){
    for (var key in Purchase.promoteLimiteMap) {
        if(channelId == key){
            return Purchase.promoteLimiteMap[key];
        }
    }
    return "notPromoteLimite" ;
}