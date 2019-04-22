$(document).ready(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems);
    });
    $('.sidenav').sidenav();
    $('.tabs').tabs();

    var loginStatus = localStorage.getItem('loggedIn');
    if (loginStatus == "true") {
        $('#userImg').attr("src", localStorage.getItem('userImg'));
        $("#userName").html(localStorage.getItem('userName'));
        $("#userEmail").html(localStorage.getItem('userEmail'));
        showDashboard();
        getAllCampaigns();
    }
    $(".bla_wrapper").removeClass("hidden");
    $(".bla_loader").addClass("hidden");

    $("#loginFormSubmit").click(function () {
        $("#loginFormSubmit").addClass("disabled");
        $("#loginProgress").removeClass("hidden");

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(xhttp.responseText);
                if (response.result.status == 200) {
                    $('#userImg').attr("src", response.result.userImg);
                    $("#userName").html(response.result.userName);
                    $("#userEmail").html(response.result.userEmail);
                    localStorage.setItem('loggedIn', "true");
                    localStorage.setItem('clientKey', response.result.clientKey);
                    localStorage.setItem('userEmail', response.result.userEmail);
                    localStorage.setItem('userImg', response.result.userImg);
                    localStorage.setItem('userName', response.result.userName);
                    showDashboard();
                    getAllCampaigns();
                } else if (response.result.status == 400) {
                    $("#loginFormSubmit").removeClass("disabled");
                    $("#loginProgress").addClass("hidden");
                }
            }
        };
        xhttp.open("POST", "https://builderjoe.pythonanywhere.com/adminLogin", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("userEmail=" + email + "&userPassword=" + password);
    });
});

function getAllCampaigns() {
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp1.responseText);
            if (response.result.length > 0 && response.result[0].status !== 400) {
                var groupedByEmail = response.result.groupBy('useremail');
                console.log(groupedByEmail);
                $("#allCampaignList").empty();
                groupedByEmail.forEach(groupedEntry => {
                    var html = '<div class="col s12 m4"><div class="card waves-effect" ' + "onclick='getCampaignDetails(" + JSON.stringify(groupedEntry[0].useremail) + ")'" + '><div class="dflex card-content bla_all_campcard"><img src="' + groupedEntry[0].company_image + '">' +
                        '<div class="bla_all_campcard1"><div class="bla_all_campcard11">' + groupedEntry[0].company_name + '</div><div class="bla_all_campcard12">' + groupedEntry[0].company_email + '</div></div>' +
                        '</div></div></div>'
                    $("#allCampaignList").append(html);
                });
            }
        }
    };
    xhttp1.open("POST", "https://builderjoe.pythonanywhere.com/getAllCampaigns", true);
    xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp1.send("clientKey=" + localStorage.getItem('clientKey'));
}

function getCampaignDetails(userEmail) {
    $("#campaignDetail").empty();
    $(".bla_campaign_exit").removeClass("hidden");
    $(".bla_campaign_toptabs").addClass("hidden");
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp2.responseText);
            console.log(response);
            response.result.forEach(userCampaign => {
                let leadDetail1 = '';
                console.log(userCampaign.campaign_id);
                getLeadsForCampaign(userCampaign.campaign_id, function (leadsResponse, status) {
                    if (status == "exists") {
                        appendCampaigns(userCampaign, leadDetail1, function(campaignSetData){
                            initCampaignData(campaignSetData);
                        });
                        console.log(leadsResponse);
                    } else {
                        console.log(leadsResponse);
                        leadDetail1 = leadDetail1 + '<div id="leadDetail" class="dflex bla_uleads_btn"> <input type="file" id="files"> <button class="bla_uleads_abtn" id="submit-parse"' +  "onclick='parseTest("+userCampaign.campaign_id+ "," + userCampaign.remaining_leads+ "," + JSON.stringify(userCampaign.useremail) + "); parseLeadsCSV.call(this);' > " + 'ADD LEADS</button> <div id="leadsDisplay" class="bla_uleads_uresult"> </div> </div>'                        
                        appendCampaigns(userCampaign, leadDetail1, function(campaignSetData){
                            initCampaignData(campaignSetData);
                        });
                    }
                });

            });
        }
    };
    xhttp2.open("GET", "https://builderjoe.pythonanywhere.com/getCampaign?userEmail=" + userEmail, true);
    xhttp2.send();
}

function appendCampaigns(userCampaign,leadData, callback) {
    let campaignDetail1 = '';
    let campaignDetail2 = '';
    let campaignImgString = userCampaign.images;
    campaignImgString = campaignImgString.replace("[", "");
    campaignImgString = campaignImgString.replace("]", "");
    campaignImgString = campaignImgString.split(",");
    campaignImgString.forEach(campaignImg => {
        campaignDetail2 = campaignDetail2 + '<a target="_blank" class="carousel-item" href=' + campaignImg + '><img src=' + campaignImg + '></a>'
    });
    campaignDetail1 = campaignDetail1 + '<div class="card row">' +
        '<div class="col s12 m6">' +
        '<div class="dflex card-content bla_all_campcard col s12 m12"><img src="' + userCampaign.company_image + '">' +
        '<div class="bla_all_campcard1"><div class="bla_all_campcard11">' + userCampaign.name + '</div><div class="bla_all_campcard12">' + userCampaign.company_email + '</div></div></div>' +
        '<div class="card-content bla_camp_detail col s12 m12">' +
        '<div class="dflex bla_camp_detail2"><div class="carousel">' + campaignDetail2 + '</div></div></div>' +
        '<div class="card-content bla_camp_detail col s12 m12">' +
        '<div class="dflex bla_camp_detail3"><div class="bla_camp_detail11">Description</div><div class="bla_camp_detail32">' + userCampaign.description + '</div></div></div>' +
        '<div class="card-content bla_camp_detail col s12 m12">' +
        '<div class="dflex bla_camp_detail1"><div class="bla_camp_detail11">Location</div><div class="bla_camp_detail12">' + userCampaign.location + '</div></div>' +
        '<div class="dflex bla_camp_detail1 bla_camp_mgn1"><div class="bla_camp_detail11">Campaign Owner</div><div class="bla_camp_detail12">' + userCampaign.company_name + '</div></div>' +
        '<div class="dflex bla_camp_detail1 bla_camp_mgn1"><div class="bla_camp_detail11">Payment ID</div><div class="bla_camp_detail12">' + userCampaign.payment_id + '</div></div></div>' +
        '</div>' +
        '<div class="col s12 m6">' +
        '<div class="card-content bla_camp_detail col s12 m12">' +
        '<div class="dflex bla_camp_detail1"><div class="bla_camp_detail11">Campaign Cost</div><div class="bla_camp_detail12">&#8377; <span>' + userCampaign.campaign_cost.toLocaleString('en-IN') + '</span></div></div>' +
        '<div class="dflex bla_camp_detail1 bla_camp_mgn1"><div class="bla_camp_detail11">Daily Leads</div><div class="bla_camp_detail12">' + userCampaign.daily_leads + '</div></div>' +
        '<div class="dflex bla_camp_detail1 bla_camp_mgn1"><div class="bla_camp_detail11">Leads Remaining</div><div class="bla_camp_detail12">' + userCampaign.remaining_leads + '</div></div>' +
        '<div class="dflex bla_camp_detail1 bla_camp_mgn1"><div class="bla_camp_detail11">Total Campaign Leads</div><div class="bla_camp_detail12">' + userCampaign.campaign_leads + '</div></div></div>' +
        '<div class="card-content bla_camp_detail col s12 m12">' + leadData + '</div>' +
        '</div></div>';
    callback(campaignDetail1);
}

function initCampaignData(campaignData){
    let campaignDetail = '<div class="col s12 m12 bla_campaign_outer">' + campaignData + '</div>';
    $("#campaignDetail").append(campaignDetail);
    $("#allCampaignList").addClass("hidden");
    $("#campaignDetail").removeClass("hidden");
    $('.carousel').carousel();
}

function getLeadsForCampaign(campaignId, callback) {
    var xhttp3 = new XMLHttpRequest();
    xhttp3.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp3.responseText);
            console.log("Leads Data", response);
            if (response.result.length > 0) {
                callback(response, "exists");
            } else {
                callback(response, "not_exists");
                // leadDetail1 = '<div class="dflex card-content bla_lead_header col s12 m12"><span>There are no leads added yet for this campaign.</span><button class="btn waves-effect waves-light bla_campaignbtn" type="submit" name="action">ADD LEADS<i class="material-icons right">group_add</i></button></div>';
            }
            // let leadDetail = '<div class="col s12 m12 bla_campaign_outer"><div class="card row">'+ leadDetail1 +'</div></div>';
        }
    };
    xhttp3.open("GET", "https://builderjoe.pythonanywhere.com/getLeads?campaignId=" + JSON.parse(campaignId), true);
    xhttp3.send();
}

function showDashboard() {
    $(".bla_wrapper_login").addClass("hidden");
    $(".bla_sidenav_wrapper").removeClass("hidden");
    $(".bla_dashboard").removeClass("hidden");
}

function showLogin() {
    $(".bla_sidenav_wrapper").addClass("hidden");
    $(".bla_dashboard").addClass("hidden");
    $("#loginProgress").addClass("hidden");
    $("#loginFormSubmit").removeClass("disabled");
    $(".bla_wrapper_login").removeClass("hidden");
}

function closeDetails() {
    $("#campaignDetail").addClass("hidden");
    // $("#leadDetail").addClass("hidden");
    $("#campaignDetail").empty();
    // $("#leadDetail").empty();
    $(".bla_campaign_exit").addClass("hidden");
    $("#allCampaignList").removeClass("hidden");
    $(".bla_campaign_toptabs").removeClass("hidden");
    $('.tabs').tabs();
}

function goToStats() {
    $(".bla_dash_screens").addClass("hidden");
    $(".bla_sidenav_items").removeClass("active");
    $(".bla_sidenav_stat").addClass("active");
    $(".bla_dashboard1").removeClass("hidden");
    closeDetails();
}

function goToCampaigns() {
    $(".bla_sidenav_items").removeClass("active");
    $(".bla_sidenav_camp").addClass("active");
    $(".bla_dash_screens").addClass("hidden");
    $(".bla_dashboard2").removeClass("hidden");
    $('.tabs').tabs();
}

function logout() {
    localStorage.clear();
    showLogin();
    window.location.reload();
}

Array.prototype.groupBy = function (prop) {
    var result = this.reduce(function (groups, item) {
        const val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {});
    return Object.keys(result).map(function (key) {
        return result[key];
    });
};