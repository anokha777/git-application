function getrepolist(gitUserId) {

    //call github api to fetch all repository.
    fetch('https://api.github.com/users/'+gitUserId+'/repos', { 
        method: "GET",
    }).then((response) => {
        response.json().then((response) => {

           

            //to remove old repository list value from DOM                
            var oldDOMIssuesList = document.getElementById('tableBody');
            while(oldDOMIssuesList.firstChild){
                oldDOMIssuesList.removeChild(oldDOMIssuesList.firstChild);
            }

            //display all repository
            document.getElementById("displayAllRepository").style.display = 'block';
            var tableBody = document.getElementById('tableBody');
            //var table = document.createElement('table');
            for (var i = 0; i < response.length; i++){
                var tr = document.createElement('tr');   

                var td0 = document.createElement('td');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                var td4 = document.createElement('td');
             
                // create issue button
                var createIssueBtn = document.createElement('BUTTON');
                var t = document.createTextNode("Create Issue"); 
                createIssueBtn.appendChild(t);
                createIssueBtn.onclick = function() { enableissuefield(this.value); };
                createIssueBtn.type = "button";
                createIssueBtn.name = "repo-url";
                createIssueBtn.value = "issue-box-id-" + response[i].name + "|submit-button-id-" + response[i].name;

                // issue name input box
                var issueNameInputBox = document.createElement('INPUT');
                issueNameInputBox.name = "issue-name";
                issueNameInputBox.id = "issue-box-id-" + response[i].name;
                issueNameInputBox.disabled = true;
                

                // summit button to create issue for repository
                var submitIssueBtn = document.createElement('BUTTON');
                var t = document.createTextNode("Submit Issue"); 
                submitIssueBtn.appendChild(t);
                submitIssueBtn.onclick = function() { submitissue(this.value); };
                submitIssueBtn.type = "button";
                submitIssueBtn.name = "repo-url";
                submitIssueBtn.id = "submit-button-id-" + response[i].name;
                submitIssueBtn.value = "issue-box-id-" + response[i].name + "|" + gitUserId + "|" + response[i].name;
                submitIssueBtn.disabled = true;

                var repoNo = document.createTextNode(i + 1);
                var repoTitle = document.createTextNode(response[i].name);
                //var createTm = document.createTextNode(response[i].created_at);

                td0.appendChild(repoNo);
                td1.appendChild(repoTitle);
                td2.appendChild(createIssueBtn);
                td3.appendChild(issueNameInputBox);
                td4.appendChild(submitIssueBtn);

                tr.appendChild(td0);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);

                tableBody.appendChild(tr);
            }
        }).catch(function () {
            console.log("Github responded successfully but there is problem in parsing response...");
        });
    }).catch(function () {
        console.log("There is error in github api call...");
    });

}

function enableissuefield(idForIssueAndSubmitButton) {
    var id_array = idForIssueAndSubmitButton.split('|');
    // var submitButtonId = id_array[1];
    // var issueNameId = id_array[0];

    document.getElementById(id_array[0]).disabled = false;
    document.getElementById(id_array[1]).disabled = false;

}

function submitissue(issueInputBoxId) {
    var id_array = issueInputBoxId.split('|');
    var issueNameId = id_array[0];
    var userId = id_array[1];
    var issueRepoName  = id_array[2];


    var issueName = document.getElementById(issueNameId).value;
    

    console.log(document.getElementById(issueNameId).value +"+ +"+ userId + "+ +" + issueRepoName);
    fetch('https://api.github.com/repos/'+userId+'/' + issueRepoName + '/issues', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 83442996045d366746d1df94670d0a656f1ed4b2'
        },
        body: JSON.stringify({
            "title": issueName,
            "body": 'issue created from application',
            "assignees": ["test-user"],
            "labels": ["bug"]
        })
    }).then((response) => {
        response.json().then(response => {
            if(response.message !='Not Found'){
                var successMsg = 'Issue created with issue number - ' + response.number;
                document.getElementById("success_msg").style.display = 'block';
                document.getElementById("success_msg").innerHTML = successMsg;
            }else{
                var successMsg = 'There are no such reposiroty with name - ' + issueRepoName + ' in your git account. Please try with valid repository name.';
                document.getElementById("fail_msg").style.display = 'block';
                document.getElementById("fail_msg").innerHTML = successMsg;               
            }
        }).catch(function () {
            console.log("Github responded successfully but there is problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is problem in parsing response...';
        });
    }).catch(function () {
        console.log("There is error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is error in github api call...';
    });

}