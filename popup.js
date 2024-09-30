document.addEventListener('DOMContentLoaded', () => {
  const addSkillButton = document.getElementById('addSkill');
  const saveProfileButton = document.getElementById('saveProfile');
  const exportDataButton = document.getElementById('exportData');
  const skillsList = document.getElementById('skillsList');

  function updateSkillsList() {
    chrome.storage.local.get(['skills'], (result) => {
      const skills = result.skills || {};
      skillsList.innerHTML = '';
      for (const skill in skills) {
        const li = document.createElement('li');
        li.textContent = `${skill} - Level: ${skills[skill]}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
          chrome.storage.local.get(['skills'], (result) => {
            const skills = result.skills || {};
            delete skills[skill];
            chrome.storage.local.set({ skills }, updateSkillsList);
          });
        });
        li.appendChild(removeButton);
        skillsList.appendChild(li);
      }
    });
  }

  addSkillButton.addEventListener('click', () => {
    const newSkill = document.getElementById('newSkill').value;
    const expertiseLevel = document.getElementById('expertiseLevel').value;
    chrome.storage.local.get(['skills'], (result) => {
      const skills = result.skills || {};
      skills[newSkill] = expertiseLevel;
      chrome.storage.local.set({ skills }, updateSkillsList);
    });
  });

  saveProfileButton.addEventListener('click', () => {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const profilePicture = document.getElementById('profilePicture').files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      const profileData = {
        name,
        email,
        profilePicture: reader.result
      };
      chrome.storage.local.set({ profile: profileData });
    };

    if (profilePicture) {
      reader.readAsDataURL(profilePicture);
    } else {
      chrome.storage.local.set({ profile: { name, email } });
    }
  });

  exportDataButton.addEventListener('click', () => {
    chrome.storage.local.get(['skills', 'activity'], (result) => {
      const skills = result.skills || {};
      const activity = result.activity || {};

      const data = {
        skills,
        activity
      };

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skill-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });

  updateSkillsList();
});
