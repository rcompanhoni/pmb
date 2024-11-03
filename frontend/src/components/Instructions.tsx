export default function Instructions() {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full md:w-auto">
      <h2 className="text-lg font-semibold mb-4">Mini Blog Instructions</h2>
      <ul className="space-y-2">
        <li>
          1. <strong>Browse without logging in:</strong> Non-logged users can
          search for posts, view posts, and read comments but cannot create,
          edit, or delete them.
        </li>
        <li>
          2. <strong>Sign Up:</strong> To sign up, simply provide an email
          address and a password. Your account will be created immediately
          without any additional verification steps.
        </li>
        <li>
          3. <strong>Sign In:</strong> After signing in, you’ll have access to
          additional options:
          <ul className="ml-4 mt-2 list-disc list-inside space-y-1">
            <li>
              Create a new post from the "Create New Post" button at the top of
              the Home page.
            </li>
            <li>
              Edit and delete your own posts directly in the main list on the
              Home page.
            </li>
            <li>
              On a post's details page, create, edit, and delete comments—only
              for comments you've posted.
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
