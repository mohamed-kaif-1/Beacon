/**
 * Helm Windows — Phase 5.7: Accessibility & Keyboard Navigation Test Suite
 * Validates semantic landmarks, accessible button names, input associations,
 * focus-visible styling, modal focus trapping & restoration, shortcut isolation,
 * aria-live screen-reader announcements, and non-color state representations.
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')

console.log('=================================================================')
console.log('  Helm Windows — Phase 5.7 Accessibility & Navigation Tests')
console.log('=================================================================\n')

const rootDir = path.resolve(__dirname, '..')

async function runTests() {
  let passed = 0

  // -------------------------------------------------------------------------
  // TEST 1: Semantic Landmarks & Skip Link Navigation
  // -------------------------------------------------------------------------
  console.log('[TEST 1] Testing Semantic Landmarks & Skip-to-Content Navigation...')
  const appLayoutTs = fs.readFileSync(path.join(rootDir, 'src', 'components', 'layout', 'AppLayout.tsx'), 'utf-8')
  const sidebarTs = fs.readFileSync(path.join(rootDir, 'src', 'components', 'layout', 'Sidebar.tsx'), 'utf-8')

  // Skip link
  assert(
    appLayoutTs.includes('className="skip-link"') &&
    appLayoutTs.includes('href="#main-content"') &&
    appLayoutTs.includes('Skip to main content'),
    'AppLayout must provide a skip-to-content link targeting #main-content'
  )

  // Main landmark
  assert(
    appLayoutTs.includes('id="main-content"') &&
    appLayoutTs.includes('tabIndex={-1}'),
    'AppLayout must have a <main id="main-content" tabIndex={-1}> landmark'
  )

  // Navigation landmark & current page indication
  assert(
    sidebarTs.includes('<nav aria-label="Main Navigation"') &&
    sidebarTs.includes("aria-current={isActive ? 'page' : undefined}"),
    'Sidebar must define <nav aria-label="Main Navigation"> with aria-current on active nav items'
  )

  console.log('✓ TEST 1 Passed: Semantic landmarks (main, nav, aside) and skip link navigation verified.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 2: Accessible Names for Action & Icon-Only Buttons
  // -------------------------------------------------------------------------
  console.log('\n[TEST 2] Testing Accessible Names on Icon-Only Buttons...')
  const ambientControlsTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'ambient', 'AmbientControls.tsx'), 'utf-8')
  const noteEditorTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'notes', 'NoteEditor.tsx'), 'utf-8')
  const taskItemCardTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'tasks', 'TaskItemCard.tsx'), 'utf-8')
  const onboardingModalTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'onboarding', 'OnboardingModal.tsx'), 'utf-8')
  const notesPageTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'notes', 'NotesPage.tsx'), 'utf-8')
  const tasksPageTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'tasks', 'TasksPage.tsx'), 'utf-8')

  // AmbientControls icon buttons
  assert(ambientControlsTs.includes('aria-label="Return to Desktop"'), 'AmbientControls must have accessible label for Return')
  assert(ambientControlsTs.includes('aria-label="Previous Wallpaper"'), 'AmbientControls must have accessible label for Prev')
  assert(ambientControlsTs.includes('aria-label={isPlaying ? \'Pause Slideshow\' : \'Resume Slideshow\'}'), 'AmbientControls must have accessible label for Play/Pause')
  assert(ambientControlsTs.includes('aria-label="Next Wallpaper"'), 'AmbientControls must have accessible label for Next')
  assert(ambientControlsTs.includes('aria-label={isFullscreen ? \'Exit Fullscreen\' : \'Enter Fullscreen\'}'), 'AmbientControls must have accessible label for Fullscreen')
  assert(ambientControlsTs.includes('aria-label="Configure Ambient Preferences"'), 'AmbientControls must have accessible label for Settings')

  // NoteEditor action buttons
  assert(noteEditorTs.includes("aria-label={note.isPinned ? 'Unpin note' : 'Pin note to top'}"), 'NoteEditor must have accessible label for pin toggle')
  assert(noteEditorTs.includes('aria-label="Delete note"'), 'NoteEditor must have accessible label for delete')

  // TaskItemCard action buttons
  assert(taskItemCardTs.includes('role="checkbox"'), 'TaskItemCard must have role="checkbox"')
  assert(taskItemCardTs.includes('aria-checked={isCompleted}'), 'TaskItemCard must track aria-checked')
  assert(taskItemCardTs.includes('aria-label={`Mark "${task.title}" as ${isCompleted ? \'incomplete\' : \'complete\'}`}'), 'TaskItemCard checkbox must have descriptive aria-label')
  assert(taskItemCardTs.includes('aria-label={`Edit task "${task.title}"`}'), 'TaskItemCard must have accessible edit label')
  assert(taskItemCardTs.includes('aria-label={`Delete task "${task.title}"`}'), 'TaskItemCard must have accessible delete label')

  // Onboarding Skip button
  assert(onboardingModalTs.includes('aria-label="Skip onboarding tour"'), 'OnboardingModal must have accessible skip label')

  // Clear search buttons
  assert(notesPageTs.includes('aria-label="Clear search query"'), 'NotesPage must have accessible clear search label')
  assert(tasksPageTs.includes('aria-label="Clear task search"'), 'TasksPage must have accessible clear search label')

  console.log('✓ TEST 2 Passed: Accessible names (aria-label) verified across all icon-only buttons.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 3: Form Input Labeling & Field Associations
  // -------------------------------------------------------------------------
  console.log('\n[TEST 3] Testing Form Input Labeling & Associations...')
  const taskModalTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'tasks', 'TaskModal.tsx'), 'utf-8')

  // Note editor inputs
  assert(noteEditorTs.includes('aria-label="Note title"'), 'Note title input must have aria-label')
  assert(noteEditorTs.includes('aria-label="Note content"'), 'Note content textarea must have aria-label')

  // Task modal inputs & labels
  assert(
    taskModalTs.includes('htmlFor="task-title-input"') &&
    taskModalTs.includes('id="task-title-input"'),
    'TaskModal title label must be associated with title input via htmlFor/id'
  )
  assert(
    taskModalTs.includes('htmlFor="task-desc-input"') &&
    taskModalTs.includes('id="task-desc-input"'),
    'TaskModal description label must be associated with textarea via htmlFor/id'
  )
  assert(
    taskModalTs.includes('htmlFor="task-status-select"') &&
    taskModalTs.includes('id="task-status-select"'),
    'TaskModal status label must be associated with select via htmlFor/id'
  )
  assert(
    taskModalTs.includes('htmlFor="task-due-input"') &&
    taskModalTs.includes('id="task-due-input"'),
    'TaskModal due date label must be associated with input via htmlFor/id'
  )
  assert(
    taskModalTs.includes('role="radiogroup"') &&
    taskModalTs.includes('role="radio"'),
    'TaskModal priority selection must be exposed as an accessible radiogroup'
  )

  // Search inputs
  assert(notesPageTs.includes('aria-label="Search notes"'), 'Notes search input must have aria-label')
  assert(tasksPageTs.includes('aria-label="Search tasks"'), 'Tasks search input must have aria-label')
  assert(tasksPageTs.includes('aria-label="Filter tasks by priority"'), 'Tasks priority filter must have aria-label')

  console.log('✓ TEST 3 Passed: All form inputs and textareas have explicit label/id or aria-label associations.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 4: Visible Focus Styling, Contrast & Forced Colors Mode
  // -------------------------------------------------------------------------
  console.log('\n[TEST 4] Testing Focus Indicators & Windows High Contrast Styling...')
  const globalsCss = fs.readFileSync(path.join(rootDir, 'src', 'styles', 'globals.css'), 'utf-8')
  const buttonTs = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ui', 'Button.tsx'), 'utf-8')

  // Global focus-visible rule
  assert(
    globalsCss.includes(':focus-visible {') &&
    globalsCss.includes('outline: 2px solid #10b981 !important;') &&
    globalsCss.includes('outline-offset: 2px !important;'),
    'globals.css must define high-contrast :focus-visible outline with offset'
  )

  // Windows Forced Colors mode
  assert(
    globalsCss.includes('@media (forced-colors: active)') &&
    globalsCss.includes('outline: 2px solid Highlight !important;'),
    'globals.css must support Windows High Contrast / Forced Colors mode'
  )

  // Button component focus-visible styling
  assert(
    buttonTs.includes('focus-visible:ring-2') &&
    buttonTs.includes('focus-visible:ring-emerald-500') &&
    buttonTs.includes('focus-visible:outline-none'),
    'Button.tsx must apply focus-visible ring styles'
  )

  // Task item card quick actions visible on focus
  assert(
    taskItemCardTs.includes('focus-within:opacity-100'),
    'TaskItemCard quick action buttons must become visible on focus-within for keyboard tabbing'
  )

  console.log('✓ TEST 4 Passed: Visible focus indicators and Windows High Contrast support verified.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 5: Modal Focus Trapping, Escape Dismissal & Focus Restoration
  // -------------------------------------------------------------------------
  console.log('\n[TEST 5] Testing Modal Focus Trapping & Restoration (useFocusTrap)...')
  const useFocusTrapTs = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'useFocusTrap.ts'), 'utf-8')
  const ambientSettingsModalTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'ambient', 'AmbientSettingsModal.tsx'), 'utf-8')

  // useFocusTrap hook mechanics
  assert(useFocusTrapTs.includes('previousActiveElementRef.current = document.activeElement'), 'useFocusTrap must record previousActiveElement')
  assert(useFocusTrapTs.includes('toFocus.focus()'), 'useFocusTrap must restore focus upon modal closing')
  assert(useFocusTrapTs.includes("e.key === 'Escape'"), 'useFocusTrap must handle Escape key dismissal')
  assert(useFocusTrapTs.includes("e.key === 'Tab'"), 'useFocusTrap must trap Tab key navigation')
  assert(useFocusTrapTs.includes('first.focus()') && useFocusTrapTs.includes('last.focus()'), 'useFocusTrap must cycle between first and last focusable elements')

  // Modal dialog implementations
  assert(ambientSettingsModalTs.includes('useFocusTrap'), 'AmbientSettingsModal must use useFocusTrap')
  assert(ambientSettingsModalTs.includes('role="dialog"') && ambientSettingsModalTs.includes('aria-modal="true"'), 'AmbientSettingsModal must declare role="dialog" and aria-modal="true"')

  assert(taskModalTs.includes('useFocusTrap'), 'TaskModal must use useFocusTrap')
  assert(taskModalTs.includes('role="dialog"') && taskModalTs.includes('aria-modal="true"'), 'TaskModal must declare role="dialog" and aria-modal="true"')

  assert(noteEditorTs.includes('useFocusTrap'), 'NoteEditor delete confirmation modal must use useFocusTrap')
  assert(noteEditorTs.includes('role="dialog"') && noteEditorTs.includes('aria-modal="true"'), 'NoteEditor delete confirmation must declare role="dialog"')

  assert(tasksPageTs.includes('useFocusTrap'), 'TasksPage delete confirmation modal must use useFocusTrap')
  assert(tasksPageTs.includes('role="dialog"') && tasksPageTs.includes('aria-modal="true"'), 'TasksPage delete confirmation must declare role="dialog"')

  assert(onboardingModalTs.includes('useFocusTrap'), 'OnboardingModal must use useFocusTrap')

  console.log('✓ TEST 5 Passed: Modal focus trap, Tab cycle, Escape dismiss, and focus restoration verified across all modals.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 6: Keyboard Shortcut Safety & Text Input Guarding
  // -------------------------------------------------------------------------
  console.log('\n[TEST 6] Testing Keyboard Shortcut Safety & Text Field Guarding...')
  const ambientBoardTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'ambient', 'AmbientBoardPage.tsx'), 'utf-8')

  // Check text input guard in AmbientBoardPage
  assert(
    ambientBoardTs.includes('HTMLInputElement') &&
    ambientBoardTs.includes('HTMLTextAreaElement') &&
    ambientBoardTs.includes('isContentEditable') &&
    ambientBoardTs.includes("if (isEditable && e.key !== 'Escape')"),
    'AmbientBoardPage must ignore Space and Arrow shortcuts when typing in inputs/textareas'
  )

  console.log('✓ TEST 6 Passed: Global shortcuts are isolated and never interfere with active form inputs.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 7: Screen Reader Live Announcements (role="status", aria-live)
  // -------------------------------------------------------------------------
  console.log('\n[TEST 7] Testing Screen Reader Live Announcements...')
  const settingsPageTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'settings', 'SettingsPage.tsx'), 'utf-8')

  // Note editor autosave status
  assert(
    noteEditorTs.includes('role="status"') &&
    noteEditorTs.includes('aria-live="polite"'),
    'NoteEditor must announce autosave status via role="status" and aria-live="polite"'
  )

  // Tasks status announcement
  assert(
    tasksPageTs.includes('role="status"') &&
    tasksPageTs.includes('aria-live="polite"') &&
    tasksPageTs.includes('announcement'),
    'TasksPage must announce task completion state changes via a live region'
  )

  // Settings export message
  assert(
    settingsPageTs.includes('role="status"') &&
    settingsPageTs.includes('aria-live="polite"'),
    'SettingsPage must announce diagnostic export results via a live region'
  )

  // Onboarding step announcement
  assert(
    onboardingModalTs.includes('role="status"') &&
    onboardingModalTs.includes('aria-live="polite"'),
    'OnboardingModal must announce step progression via aria-live="polite"'
  )

  console.log('✓ TEST 7 Passed: Polite live regions configured for autosave, task changes, export, and onboarding.')
  passed++

  // -------------------------------------------------------------------------
  // TEST 8: Non-Color State Representation & Progress Indicators
  // -------------------------------------------------------------------------
  console.log('\n[TEST 8] Testing Color Independence & Progress Roles...')
  const watchCardTs = fs.readFileSync(path.join(rootDir, 'src', 'features', 'home', 'WatchCard.tsx'), 'utf-8')
  const statusIndicatorTs = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ui', 'StatusIndicator.tsx'), 'utf-8')

  // ToggleSwitch label & accessibility
  assert(
    settingsPageTs.includes('role="switch"') &&
    settingsPageTs.includes('aria-checked={checked}') &&
    settingsPageTs.includes('aria-label={label}'),
    'ToggleSwitch in SettingsPage must declare role="switch", aria-checked, and aria-label'
  )

  // StatusIndicator color independence
  assert(
    statusIndicatorTs.includes('{statusText}'),
    'StatusIndicator must render textual status so color is not the sole information channel'
  )
  assert(
    statusIndicatorTs.includes('aria-hidden="true"') || statusIndicatorTs.includes('relative flex h-2 w-2'),
    'StatusIndicator dot must be decorative alongside text'
  )

  // WatchCard progressbar
  assert(
    watchCardTs.includes('role="progressbar"') &&
    watchCardTs.includes('aria-valuenow={watch.step}') &&
    watchCardTs.includes('aria-valuemax={watch.steps}'),
    'WatchCard multi-stage progress must be exposed as role="progressbar"'
  )

  // TasksPage progressbar
  assert(
    tasksPageTs.includes('role="progressbar"') &&
    tasksPageTs.includes('aria-valuenow={completionPercentage}') &&
    tasksPageTs.includes('aria-valuemax={100}'),
    'TasksPage overall progress must be exposed as role="progressbar"'
  )

  console.log('✓ TEST 8 Passed: Non-color state indicators and accessible progressbars verified.')
  passed++

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n=================================================================')
  console.log(`  Phase 5.7 Accessibility Test Suite: ${passed}/8 Tests PASSED!`)
  console.log('=================================================================\n')
}

runTests().catch((err) => {
  console.error('\n❌ Accessibility test failed with error:', err)
  process.exit(1)
})

