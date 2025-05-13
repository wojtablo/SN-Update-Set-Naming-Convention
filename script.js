/*
	Author: Wojciech Mikołajewski <w.mikolajewski@protonmail.ch>
	Created date: 2024.03.05
	Description: The script below verifies whether the update set's name adheres to the specified naming convention (read more here: https://confluence.alm.dsv.com/x/2gI1S). Ignore update sets created by "system" user. Distinct conventions are established for DSV internal developers and external contributors engaged in projects. For external developers we require to provide a unique identifier of the project. If you encounter difficulties saving your update set, contact the Project Manager to facilitate communication with the ESM team.

	Naming convention pattern:   CINTO; BRO; 27-12-24; 234; Story name
								    \     \       \      \          \__ Story title or update set name
									 \     \       \      \
									  \     \       \      \__ Jira Issue ID (or Story ID for externals, format: STRYxxxxx)
								       \     \       \       
									    \     \       \___ Updat set ceation date, format: dd-mm-yy
									     \     \ 
									      \     \__ Developer initials (2-3 characters)
									       \
								  		    \__ Project ID is mandatory only externals (fixed list of choice)

*/

(function executeRule(current, previous) {
    var updateSetName = current.getValue("name");
    
    // Ignore update sets auto-created by Catalog Builder
    if (updateSetName.match(/^CB_/g)) {
        return;
    }
	//Ignore SN auto-created update sets when applying batch update set
	if (updateSetName=='Unified update set') {
        return;
    }
    
    // Get vendors data
    vendorsJson = JSON.parse(gs.getProperty("development.projects"));

    // Get current user's email domain
    var currUserEmail = gs.getUser().getEmail();
    var currUserEmailDomainArr = currUserEmail.match(/@(.+)$/);
    if (!currUserEmailDomainArr || currUserEmailDomainArr.length < 2) {
        gs.addErrorMessage("Unable to extract email domain.");
		current.setAbortAction(true);
    }
    var currUserEmailDomain = currUserEmailDomainArr[1];

    // Check if the update set name adheres to the specified naming convention
    if (vendorsJson.hasOwnProperty(currUserEmailDomain)) {
        var vendorPatterns = vendorsJson[currUserEmailDomain];
          var isValid = vendorPatterns.some(function (item) {
            if(item.status === "active"){
                var getRegex = new RegExp(item.regex, "i");
                return getRegex.test(updateSetName);
            }
        });
        if (!isValid) {
            var link = '<a target="_blank" href="#">Click here to read more about the naming convention</a>';
            gs.addErrorMessage("The given name does not adhere to the specified naming convention for Update Sets in DSV. " + link);
            current.setAbortAction(true);
        }
		else {
			return;
		}
    } else {
        gs.addErrorMessage("No vendor-specific naming convention found for the current user's email domain: " + currUserEmailDomain);
		current.setAbortAction(true);
    }
})(current, previous);