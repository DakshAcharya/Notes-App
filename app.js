let notes = []
let editingID = null

// Open Dialog ====================
function openNoteDialog(noteID = null) {
  const dialog = document.getElementById("noteDialog")
  const title = document.getElementById("noteTitle")
  const content = document.getElementById("noteContent")

  if (noteID) {
    const editNote = notes.find(note => note.id === noteID)
    editingID = noteID
    document.getElementById("dialogTitle").textContent = "Edit Note"
    title.value = editNote.title
    content.value = editNote.content
  } else {
    editingID = null
    document.getElementById("dialogTitle").textContent = "Add New Note"
    title.value = ""
    content.value = ""
  }

  dialog.showModal()
  title.focus()
}

// Open Theme Dialog ====================
function openThemeDialog() {
  const dialog = document.getElementById("ThemeDialog")
  dialog.showModal()
}

// Close Dialog ====================
function closeNoteDialog() {
  document.getElementById("noteDialog").close()
}

// Close Theme Dialog ====================
function closeThemeDialog() {
  document.getElementById("ThemeDialog").close()
}

// Submit Clicked ====================
function saveNote(event) {
  event.preventDefault()

  const title = document.getElementById("noteTitle").value.trim()
  const content = document.getElementById("noteContent").value.trim()

  if (editingID) {
    const noteIndex = notes.findIndex(note => note.id === editingID)
    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      content
    }
  } else {
    notes.unshift({
      id: generateID(),
      title,
      content
    })
  }

  saveNotes()
  renderNotes()
  closeNoteDialog()
}

// Generate an ID for note ====================
function generateID() {
  return Date.now().toString()
}

// Save the Notes to localStorage ====================
function saveNotes() {
  localStorage.setItem("Notes App", JSON.stringify(notes))
}

// Show Notes ====================
function renderNotes() {
  const notesContainer = document.getElementById("notesContainer")
  const emptyState = document.getElementById("emptyState")

  if (notes.length === 0) {
    emptyState.style.display = "flex"
    notesContainer.style.display = "none"
  } else {
    emptyState.style.display = "none"
    notesContainer.style.display = "grid"
    notesContainer.innerHTML = notes.map(note => `
      <div class="note-card">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
        <div class="note-actions">
          <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button class="delete-btn" onclick="deleteNotes('${note.id}')" title="Delete Note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
            </svg>
          </button>
        </div>
      </div>
    `).join("")
  }
}

function changeTheme() {  
  document.body.classList.toggle("light-theme")
  document.body.classList.toggle("dark-theme")
  document.body.classList.toggle("red-theme")
  document.body.classList.toggle("orange-theme")
  document.body.classList.toggle("amber-theme")
  document.body.classList.toggle("pink-theme")
  document.body.classList.toggle("purple-theme")
  document.body.classList.toggle("blue-theme")
  document.body.classList.toggle("green-theme")
}

// Delete note ====================
function deleteNotes(noteID) {
  notes = notes.filter(note => note.id != noteID)
  saveNotes()
  renderNotes()
}

// Load Notes from localStorage ====================
function loadNotes() {
  const saved = localStorage.getItem("Notes App")
  return saved ? JSON.parse(saved) : []
}

// Initialize App ====================
document.addEventListener("DOMContentLoaded", function () {
  notes = loadNotes()
  renderNotes()
  document.getElementById("noteDialog").addEventListener("submit", saveNote)
  document.getElementById("themeToggle").addEventListener("click", changeTheme)
})